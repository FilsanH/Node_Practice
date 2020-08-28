const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('views engine', 'ejs') // place before any app.use, app.get/post
//Place bodyParser before CRUD
// this converts the data in the form element to something that is readable and adds it to the req.body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) //handle json format and put in body

// make public folder accessible to public
app.use(express.static('public'))

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

    //All routes:

    //get qoutes from the database
    app.get('/', (req, res) => {
      //returns object that contains all quotes from database
      const cursor = _db
        .collection('quotes')
        .find()
        .toArray()
        .then((results) => {
          console.log(results)
          res.render('index.ejs', { quotes: results })
        })
        .catch((error) => console.error(error))
    })

    // create post
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

    //PUT
    app.put('/quotes', (req, res) => {
      console.log(req.body)
      quotesCollection
        .findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true, // if doesn't exists insert this
          }
        )
        .then((result) => {
          console.log(result)
          res.json('Success')
          //can not redirect here so instead reload page in javascript
        })
        .catch((error) => console.error(error))
    })

    //Delete route
    app.delete('/quotes', (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {   // check that item exists 
            return res.json('No quote to delete')  // this will alter the message div 
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch((error) => console.error(error))
    })

    app.listen(3000, () => {
      console.log('listenting on 3000')
    })
  }
)
