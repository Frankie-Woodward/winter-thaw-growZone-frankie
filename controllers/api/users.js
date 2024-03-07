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

// Login Route
router.post('/login', async (req, res) => {
    try {
        // Find the user in the database by email
        const user = await db.User.findOne({ email: req.body.email });
        
        // Check if user was found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // For simplicity, this example just checks if the passwords match.
        // In a real-world scenario, you should hash passwords and use a method to compare the hashed password.
        if (req.body.password !== user.password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        
        // For this example, just return the user (excluding the password). In real applications, consider using JWTs for managing sessions.
        const { password, ...userWithoutPassword } = user.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

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

// Add this route to your user routes
router.put('/:userId/plants', async (req, res) => {
    try {
        // Assuming req.body contains an array of plants to add
        const user = await db.User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.myplants.push(...req.body.plants); // Add plants to the user's myplants array
        await user.save(); // Save the user document with the new plants
        res.json(user); // Respond with the updated user document
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* Export these routes so that they are accessible in `server.js`
---------------------------------------------------------- */
module.exports = router
