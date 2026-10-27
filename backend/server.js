const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

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

    await collection.insertOne({
        name,
        email,
        password: hashedPassword,
        pin: hashedPin,
        pinAttempts: 0,
        lockoutUntil: null
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
        message: 'Login successful'
    });
});

 app.get("/auth/me", authenticateToken, async (req, res) => {
    res.json({
        authenticated: true,
        user: req.user
    });
});

// VERIFY VAULT PIN
app.post('/verify-pin', authenticateToken, async (req, res) => {
    const { pin } = req.body;

    if (!pin) {
        return res.status(400).json({
            success: false,
            message: 'PIN is required'
        });
    }

    const db = client.db(dbName);
    const collection = db.collection('users');

    const user = await collection.findOne({ _id: new ObjectId(req.user.id) });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // 1. Check if user is locked out
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
        const remainingMinutes = Math.ceil(
            (new Date(user.lockoutUntil) - new Date()) / (60 * 1000)
        );
        return res.status(429).json({
            success: false,
            message: `Locked out. Try again in ${remainingMinutes} minute(s).`
        });
    }

    // 2. Compare PIN against stored hash
    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
        const attempts = (user.pinAttempts || 0) + 1;
        let updateData = { pinAttempts: attempts };

        // Lock out after 3 failed attempts for 2 minutes
        if (attempts >= 3) {
            updateData.lockoutUntil = new Date(Date.now() + 2 * 60 * 1000);
            updateData.pinAttempts = 0;
        }

        await collection.updateOne(
            { _id: new ObjectId(req.user.id) },
            { $set: updateData }
        );

        if (attempts >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Account locked for 2 minutes due to 3 failed attempts.'
            });
        }

        return res.status(401).json({
            success: false,
            message: `Incorrect PIN. ${3 - attempts} attempt(s) remaining.`
        });
    }

    // 3. Reset on success
    await collection.updateOne(
        { _id: new ObjectId(req.user.id) },
        { $set: { pinAttempts: 0, lockoutUntil: null } }
    );

    res.json({
        success: true,
        message: 'PIN verified successfully'
    });
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
    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const result = await collection.deleteOne({
        _id: new ObjectId(req.body._id),
        userId: req.user.id
    });

    res.send({
        success: true,
        result: result
    });
});


// UPDATE A PASSWORD
app.put('/', authenticateToken, async (req, res) => {
    const { _id, website, username, password } = req.body;

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
                password
            }
        }
    );

    res.send({
        success: true,
        result: result
    });
});

// START SERVER
module.exports = app;