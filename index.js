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
        const customerComments = client.db('customerComments').collection('comments')
        const myItems = client.db('myItems').collection('item');

        // laptop collection
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
                app.post('/items', async (req, res) => {
                    const newItem = req.body;
                    console.log(newItem);
                    const result = await laptopCollection.insertOne(newItem);
                    res.send(result);
                })
        
                // add my items
                app.post('/myItems', async (req, res) => {
                    const newItem = req.body;
                    console.log(newItem);
                    const result = await myItems.insertOne(newItem);
                    res.send(result);
                })
        
                // add items history
                app.get('/myItems', async (req, res) => {
                    const email = req.query.email;
                        const query = {email: email};
                        const cursor = laptopCollection.find(query);
                        const result = await cursor.toArray();
                        res.send(result)
                })

                // update item when click delivery button
                app.put('/items/:id', async (req, res) => {
                    const id = req.params.id;
                    const itemUpdate = req.body;
                    const filter = { _id: ObjectId(id) };
                    const option = { upsert: true };
                    const itemUpdateDoc = {
                        $set: {
                            quantity: itemUpdate.newQuantity
                        }
                    };
                    const result = await laptopCollection.updateOne(filter, itemUpdateDoc, option);
                    res.send(result);
                })

                // delete one
                app.delete('/items/:id', async (req, res) => {
                    const id = req.params.id;
                    const query = { _id: ObjectId(id) };
                    const result = await laptopCollection.deleteOne(query);
                    res.send(result);
                })
        

        // customer comments
                app.get('/comments', async (req, res) => {
                    const query = {};
                    const cursor = customerComments.find(query);
                    const comments = await cursor.toArray();
                    res.send(comments);
                })
                // add new item
                app.post('/comments', async (req, res) => {
                    const newItem = req.body;
                    const result = await customerComments.insertOne(newItem);
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