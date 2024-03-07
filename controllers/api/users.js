/* 
-------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/api/comments`
------------------------------------------------------------- */

/* Require modules
---------------------------------------------------------- */
const express = require('express')
// Router allows us to handle routing outisde of server.js
const router = express.Router()


/* Require the db connection, and models
---------------------------------------------------------- */
const db = require('../../models')


/* Routes
---------------------------------------------------------- */
// Index Route (GET/Read): Will display all users
router.get('/', function (req, res) {
    db.User.find({})
        .then(users => res.json(users))
        .catch(error => res.status(500).json({ error: error.message }));
});

router.get('/:userId', function (req, res) {
    db.User.findById(req.params.userId )
        .then(user => res.json(user))
})

// Create Route (POST/Create): This route receives a POST request and
// creates a new user document using the request body
router.post('/new', (req, res) => {
    console.log('Request received at /api/users/new');
    db.User.create(req.body)
        .then(user => res.json(user))
})

// Update Route (PUT/Update): This route receives a PUT request and 
// edits the specified comment document using the request body
router.put('/:userId', (req, res) => {
    db.User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true }
    )
        .then(user => res.json(user))
})

// Destroy Route (DELETE/Delete): This route deletes a comment document 
// using the URL parameter (which will always be the comment document's ID)
router.delete('/:userId', (req, res) => {
    db.User.findByIdAndDelete(req.params.userId)
        .then(() => res.json({ deletedUserId: req.params.userId }))
})


/* Export these routes so that they are accessible in `server.js`
---------------------------------------------------------- */
module.exports = router
