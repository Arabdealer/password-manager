const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors');
dotenv.config();
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
 
// Database Name
const dbName = 'passop';
const app = express();
const port = 3000;

// Middleware
app.use(bodyparser.json())
app.use(cors())
console.log(process.env.MONGO_URI);



// await client.connect();
// Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})
// Save a password
app.post('/', async (req, res) => { 
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})

// Delete a password by id
app.delete('/', async (req, res) => {
    const { ObjectId } = require('mongodb');
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne({
        _id: new ObjectId(req.body._id)
    });

    res.send({
        success: true,
        result: result
    });
});
// update a password by id
app.put('/', async (req, res) => {
    const { ObjectId } = require("mongodb");

    const { _id, website, username, password } = req.body;

    const db = client.db(dbName);
    const collection = db.collection("passwords");

    const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
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
        result : result
    });
});


app.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
})