const router = require('express').Router()

//import the projects db
const Projects = require('../data/helpers/projectModel')


router.post('/', (req, res) => {

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

module.exports = router