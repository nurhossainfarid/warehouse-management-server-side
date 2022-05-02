const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://warehouse-management:oYVZFxLnXVmBf6aT@cluster0.vg8li.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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