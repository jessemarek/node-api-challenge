const router = require('express').Router()

//Import the actions db
const Actions = require('../data/helpers/actionModel')

//Get a specific action by ID
router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action)
})
//Delete a specific action
router.delete('/:id', validateActionId, (req, res) => {

})
//Update a specific action
router.put('/:id', validateActionId, (req, res) => {

})


//Custom middleware
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

function validateActionId(req, res, next) {
    const { id } = req.params
    Actions.get(id)
        .then(action => {
            if (action) {
                req.action = action
                next()
            }
            else {
                res.status(404).json({ errorMessage: "Invalid action ID!" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "Server failed to find a action with that ID!" })
        })
}

module.exports = router