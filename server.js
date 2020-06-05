//Create the server
const express = require('express')
const server = express()

//Routers
const projectRouter = require('./routes/projectRouter')


//Built in middleware
server.use(express.json())

//Routes
server.use('/api/projects', projectRouter)


server.get('/', (req, res) => {
    res.status(200).json({ message: "API is up and running!" })
})

module.exports = server