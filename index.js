require('dotenv').config()

//use express
const express = require('express')

//create app var
const app = express()

//connect db
let mongoose = require('mongoose')

// if connecting to vps use "mongodb://localhost/myBands" else process.env.DATABASE_URL
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

// give error when failed to connect to DB
db.on('error', (error) => console.log(error))

// when connected send message
db.once('open', () => console.log('Connected to DB'))

//use bodyparser
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))

// main route
app.get('/', (req, res) => {
    console.log('End point /')

    res.header("Content-Type", "application/json")
    res.send("{ \"message\": \"Hello World!\" }")
})

let bandsRouter = require('./routes/bandsRoutes')();

app.use('/api', bandsRouter)

//start web server on port 8000
app.listen(8000, ()=> console.log("Starting REST API on http://localhost:8000/"))