const router = require('express').Router()

//import the projects db
const Projects = require('../data/helpers/projectModel')


router.post('/', validateProject, (req, res) => {
    Projects.insert(req.body)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to create a new project!" })
        })
})

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to retrieve list of projects!" })
        })
})

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
})

router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.params.id)
        .then(count => {
            if (count) {
                res.status(200).json(req.project)
            } else {
                res.status(500).json({ errorMessage: "Server failed to delete the project!" })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to delete the project!" })
        })
})

router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Projects.update(req.params.id, req.body)
        .then(project => {
            if (project) {
                res.status(200).json(project)
            } else {
                res.status(500).json({ errorMessage: "Server did not update the project!" })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server did not update the project!" })
        })
})



//Custom middleware
function validateProject(req, res, next) {
    if (req.body.name && req.body.description) {
        next()
    } else if (!req.body.name) {
        res.status(400).json({ errorMessage: "PLease provide a project name!" })
    } else if (!req.body.description) {
        res.status(400).json({ errorMessage: "PLease provide a project description!" })
    } else {
        res.status(400).json({ errorMessage: "PLease provide a project name and description!" })
    }
}

function validateProjectId(req, res, next) {
    const { id } = req.params
    Projects.get(id)
        .then(project => {
            if (project) {
                req.project = project
                next()
            }
            else {
                res.status(404).json({ errorMessage: "Invalid project ID!" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Server failed to find a project with that ID!" })
        })
}

module.exports = router