const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cors = require('cors')

// Always require and configure near the top 
require('dotenv').config();

// Connect to the database
const db = require('./controllers/api/users')


const app = express();
/* ______________________________________________ */

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build', 'start')));

// Middleware to verify token and assign user object of payload to req.user.
// Be sure to mount before routes
// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

// Put API routes here, before the "catch all" route
const userCtrl = require('./controllers/api/users')

app.use('/api/users', userCtrl)

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });