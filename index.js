const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const port = process.env.PORT || 5055;


app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('This is full-stack-server!')
})



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.ggphq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const booksCollection = client.db("user").collection("users");

    //get books from db
    app.get('/books', (req, res) => {
        booksCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    //post books to db

    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        console.log(newBook);
        booksCollection.insertOne(newBook)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result.insertedCount)
            })
    })

    //manage books

    app.get('/manage', (req, res) => {
        booksCollection.find({})
            .toArray((err, items) => {
                res.send(items)
            })
    })

    //load single product for update

    app.get('/book/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        booksCollection.find({ _id: id })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    //delete single book item

    app.delete('/deleteBook/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        booksCollection.findOneAndDelete({ _id: id })
            .then(documents => res.send(!!documents.value))
    })
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})