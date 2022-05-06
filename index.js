const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.user_DB}:${process.env.password_DB}@cluster0.vg8li.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const laptopCollection = client.db('laptopCollection').collection('items');

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = laptopCollection.find(query);
            const collection = await cursor.toArray();
            res.send(collection);
        })

        // selected by id
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await laptopCollection.findOne(query);
            res.send(result);
        })

        // add new item
        // app.post('/items', async (req, res) => {
        //     const newItem = req.body;
        //     console.log(newItem);
        //     const result = await laptopCollection.insertOne(newItem);
        //     res.send(result);
        // })
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            console.log(newItem);
            const result = await laptopCollection.insertOne(newItem);
            res.send(result);
        })

        // delete one
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await laptopCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        
    }
};
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('warehouse server side is running')
});

app.listen(port, () => {
    console.log('server is running');
})