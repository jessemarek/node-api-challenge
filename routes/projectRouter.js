const router = require('express').Router()

//import the projects db
const Projects = require('../data/helpers/projectModel')


router.post('/', validateProject, (req, res) => {
    Projects.insert(req.body)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to create a new project" })
        })
})

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to retrieve list of projects" })
        })
})

function validateProject(req, res, next) {
    if (req.body.name && req.body.description) {
        next()
    } else if (!req.body.name) {
        res.status(400).json({ errorMessage: "PLease provide a project name" })
    } else if (!req.body.description) {
        res.status(400).json({ errorMessage: "PLease provide a project description" })
    } else {
        res.status(400).json({ errorMessage: "PLease provide a project name and description" })
    }
}

module.exports = router