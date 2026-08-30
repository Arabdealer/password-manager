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
    origin: 'http://localhost:5173',
    credentials: true
}));

// REGISTER USER

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
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

    await collection.insertOne({
        name,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        success: true,
        message: 'User registered successfully'
    });
});
// LOGIN USER
app.post('/login', async (req, res) => {
    app.get("/auth/me", authenticateToken, async (req, res) => {
    res.json({
        authenticated: true,
        user: req.user
    });
});
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
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 1000
    });

    res.json({
        success: true,
        message: 'Login successful'
    });
});
app.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false
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

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});