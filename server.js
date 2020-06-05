//Create the server
const express = require('express')
const server = express()

//Routers
const projectsRouter = require('./routes/projectsRouter')
const actionsRouter = require('./routes/actionsRouter')


//Built in middleware
server.use(express.json())

//Routes
server.use('/api/projects', projectsRouter)
server.use('/api/action', actionsRouter)


server.get('/', (req, res) => {
    res.status(200).json({ message: "API is up and running!" })
})

module.exports = server