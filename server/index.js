const express = require('express')
const dotenv = require('dotenv');
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db/connection')
const router = require('./routes/router')

const app = express()
const port = 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', router)

app.listen(port, () => console.log(`Server running on port ${port}`))
