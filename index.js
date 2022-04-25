const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// mango
// user: dbmangotest
// pass: Y8wvuoNezPsTst0M

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2bong.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db('expressmongotest').collection('testuser');
        app.get('/api/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);

        });
        app.get('/api/user/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const user = await userCollection.findOne(query);
            res.send(user);

        });
        app.post('/api/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });
        app.delete('/api/user/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        app.put('/api/user/:id', async (req, res) => {
            const upUser = req.body;
            const filter = { _id: ObjectId(req.params.id) };
            const options = { upsert: true };
            const upDoc = {
                $set: {
                    name: upUser.name,
                    age: upUser.age,
                    gender: upUser.gender,
                    money: upUser.money
                }
            };
            const result = await userCollection.updateOne(filter, upDoc, options);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! nodemon');
})

app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
})