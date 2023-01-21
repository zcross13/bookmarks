require('dotenv').config()
require('./config/database') //create database 

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json()) // can handle json when the front end send it 
app.use((req,res,next) => {
    res.locals.data ={}
    next()
})

app.use(logger('dev'))
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico'))) // we dont know what time of computer the person is using so it will normalized the path regardless 
app.use(express.static(path.join(__dirname, 'build')))  //anything in the build folder will shown

app.use('/api/users', require('./routes/api/users'))
app.use('/api/bookmarks', require('./routes/api/bookmarks'))

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html')) //wasnt a static file or api route
})

app.listen(PORT, () => {
    console.log(`I am listening on PORT: ${PORT}`)
})