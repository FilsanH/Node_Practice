const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//Place bodyParser before CRUD
// this converts the data in the form element to something that is readable and adds it to the req.body
app.use(bodyParser.urlencoded({ extended: true }))

//All routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req, res) => {
  console.log('form submitted')
  console.log(req.body)
})

app.listen(3000, () => {
  console.log('listenting on 3000')
})
