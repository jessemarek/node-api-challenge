const router = require('express').Router()

//import the projects and actions DBs
const Projects = require('../data/helpers/projectModel')
const Actions = require('../data/helpers/actionModel')

//Create a new project
router.post('/', validateProject, (req, res) => {
    Projects.insert(req.body)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to create a new project!" })
        })
})
//Create a new action on an existing project
router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    Actions.insert(req.action)
        .then(action => {
            if (action) {
                res.status(201).json(action)
            }
            else {
                res.status(500).json({ errorMessage: "Server failed to create new action!" })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to create new action!" })
        })
})
//Get a list of all projects
router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to retrieve list of projects!" })
        })
})
//Get a project by ID
router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
})
//Get a list of the actions from a specific project
router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.project.id)
        .then(actions => {
            if (actions.length) {
                res.status(200).json(actions)
            } else {
                res.status(404).json({ errorMessage: "No actions found for this project!" })
            }
        })
        .catch(err => {
            res.status(500).json({ errorMessage: "Server failed to retrieve the actions for this project!" })
        })
})
//Remove a project
router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.project.id)
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
//Update a project
router.put('/:id', validateProjectId, validateProject, (req, res) => {
    Projects.update(req.project.id, req.body)
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

function validateAction(req, res, next) {
    if (req.body.description && req.body.notes) {
        req.action = {
            description: req.body.description,
            notes: req.body.notes,
            project_id: req.project.id
        }
        next()
    } else if (!req.body.notes) {
        res.status(400).json({ errorMessage: "PLease provide action notes!" })
    } else if (!req.body.description) {
        res.status(400).json({ errorMessage: "PLease provide action description!" })
    } else {
        res.status(400).json({ errorMessage: "PLease provide action notes and description!" })
    }
}

module.exports = router