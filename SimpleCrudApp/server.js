const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//Place bodyParser before CRUD
// this converts the data in the form element to something that is readable and adds it to the req.body
app.use(bodyParser.urlencoded({ extended: true }))

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionString = `mongodb+srv://dev:filsanhassan@cluster1.iojny.mongodb.net/starWars?retryWrites=true&w=majority`
//using callbacks :
/*
MongoClient.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    const db = client.db()
    console.log(db)
  }
) */
// using promises
//split into two one connects to client the other returns db and thefore lets you change dbs

let _db
MongoClient.connect(connectionString, { useUnifiedTopology: true }).then(
  (client) => {
    console.log('Connected to Database')
    // The database
    _db = client.db()
    // create a collection
    const quotesCollection = _db.collection('quotes')

    //All routes
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html')
    })

    app.post('/quotes', (req, res) => {
      // add quote to quotes colection
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          console.log(result)
          res.redirect('/')
        })
        .catch((err) => console.log(err))
    })

    app.listen(3000, () => {
      console.log('listenting on 3000')
    })
  }
)
