const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const crypto = require('crypto');

const authenticateToken = require('./middleware/auth');

dotenv.config();

const app = express();
const port = 3000;

// Database
const dbName = 'passop';
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Middleware
app.use(bodyparser.json());
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.options("*", cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

// REGISTER USER

app.post('/register', async (req, res) => {
    const { name, email, password, pin } = req.body;

    if (!name || !email || !password || !pin) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    if (!/^\d{6}$/.test(pin)) {
        return res.status(400).json({
            success: false,
            message: 'PIN must be exactly 6 digits'
        });
    }

    const db = client.db(dbName);
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ email });

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'User already exists'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    const salt = crypto.randomBytes(16).toString('base64');

    await collection.insertOne({
        name,
        email,
        password: hashedPassword,
        pin: hashedPin,
        pinAttempts: 0,
        lockoutUntil: null,
        salt: salt
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully'
    });
});
// LOGIN USER
app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    const db = client.db(dbName);
    const collection = db.collection('users');

    const user = await collection.findOne({ email });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    const token = jwt.sign(
        {
            id: user._id.toString()
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true
        ,
        maxAge: 60 * 60 * 1000
    });

    res.json({
        success: true,
        message: 'Login successful',
        salt: user.salt
    });
});

app.get("/auth/me", authenticateToken, async (req, res) => {
    const db = client.db(dbName);
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(req.user.id) });

    if (!user) {
        return res.status(404).json({ authenticated: false, message: "User not found" });
    }

    res.json({
        authenticated: true,
        user: { id: user._id, email: user.email, name: user.name },
        salt: user.salt
    });
});
//  Reusable function PIN Verification & Lockout Logic
async function verifyUserPin(userId, pin) {
    if (!pin) {
        return { success: false, status: 400, message: 'PIN is required' };
    }

    const db = client.db(dbName);
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
        return { success: false, status: 404, message: 'User not found' };
    }

    // 1. Check if user is currently locked out
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
        const remainingMinutes = Math.ceil(
            (new Date(user.lockoutUntil) - new Date()) / (60 * 1000)
        );
        return {
            success: false,
            status: 429,
            message: `Locked out. Try again in ${remainingMinutes} minute(s).`
        };
    }

    // 2. Check if PIN matches
    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
        const attempts = (user.pinAttempts || 0) + 1;
        let updateData = { pinAttempts: attempts };

        if (attempts >= 3) {
            updateData.lockoutUntil = new Date(Date.now() + 2 * 60 * 1000);
            updateData.pinAttempts = 0;
        }

        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (attempts >= 3) {
            return {
                success: false,
                status: 429,
                message: 'Account locked for 2 minutes due to 3 failed attempts.'
            };
        }

        return {
            success: false,
            status: 401,
            message: `Incorrect PIN. ${3 - attempts} attempt(s) remaining.`
        };
    }

    // 3. Reset attempts on success
    await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { pinAttempts: 0, lockoutUntil: null } }
    );

    return { success: true };
}

// VERIFY VAULT PIN
app.post('/verify-pin', authenticateToken, async (req, res) => {
    const result = await verifyUserPin(req.user.id, req.body.pin);
    if (!result.success) {
        return res.status(result.status).json({ success: false, message: result.message });
    }
    res.json({ success: true, message: 'PIN verified successfully' });
});


app.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    });

    res.json({
        success: true,
        message: "Logged out successfully"
    });
});

// GET ALL PASSWORDS
app.get('/', authenticateToken, async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const findResult = await collection
        .find({
            userId: req.user.id
        })
        .toArray();

    res.json(findResult);
});
// SAVE A PASSWORD
app.post('/', authenticateToken, async (req, res) => {
    const password = {
        ...req.body,
        userId: req.user.id
    };

    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const findResult = await collection.insertOne(password);

    res.send({
        success: true,
        result: findResult
    });
});

// DELETE A PASSWORD

app.delete('/', authenticateToken, async (req, res) => {
    const { _id, pin } = req.body;

    const pinCheck = await verifyUserPin(req.user.id, pin);
    if (!pinCheck.success) {
        return res.status(pinCheck.status).json({
            success: false,
            message: pinCheck.message
        });
    }
    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const result = await collection.deleteOne({
        _id: new ObjectId(_id),
        userId: req.user.id
    });

    res.send({
        success: true,
        result: result
    });
});


// UPDATE A PASSWORD
app.put('/', authenticateToken, async (req, res) => {
    const { _id, website, username, ciphertext, iv, pin } = req.body;

    if (!website || !username || !ciphertext || !iv) {
        return res.status(400).json({
            success: false,
            message: 'Website, username, ciphertext, and IV are required'
        });
    }

    const pinCheck = await verifyUserPin(req.user.id, pin);
    if (!pinCheck.success) {
        return res.status(pinCheck.status).json({
            success: false,
            message: pinCheck.message
        });
    }

    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const result = await collection.updateOne(
        {
            _id: new ObjectId(_id),
            userId: req.user.id
        },
        {
            $set: {
                website,
                username,
                ciphertext,
                iv
            }
        }
    );

    res.json({
        success: true,
        result: result
    });
});

// START SERVER
module.exports = app;