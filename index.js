//connect db
let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myBands', {useNewUrlParser: true, useUnifiedTopology: true})

console.log("Starting REST API on http://localhost:8000/")

//use express
const express = require('express')

//create app var
const app = express()

//use bodyparser

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))

// url config for /
app.get('/', function(req, res) {
    console.log('End point /')

    res.header("Content-Type", "application/json")
    res.send("{ \"message\": \"Hello World!\" }")

})

let bandsRouter = require('./routes/bandsRoutes')();

app.use('/api', bandsRouter)

//start web server on port 8000
app.listen(8000)