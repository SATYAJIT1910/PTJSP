/**
 * @author Satyajit Ghosh
 * @date 2022-11-25
 */
'use strict';

const blockexecute = require('./blockchainExecuter')
const path = require('path');
const express = require("express");
const app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Static files serve Middleware
app.use(express.static(path.join(__dirname, 'static')));
// Public
app.use(express.static('public'));
// Session-management
const session = require('express-session')
// Session Setup
app.use(session({

    // It holds the secret key for session
    secret: 'Your_Secret_Key',

    // Forces the session to be saved
    // back to the session store
    resave: true,

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))
// Routers
var admin = require('./routes/admin.js');
var hr = require('./routes/hr.js');
var jobseeker = require('./routes/jobseeker.js');

app.use('/admin', admin);
app.use('/jobseeker', jobseeker);
app.use('/hr', hr);
////

// This starts the express server
app.listen(3000, async () => {
    console.log("Started on PORT 3000");
    console.log("Server Started Successfully");
    blockexecute.initcont();
})
// root directory
app.get('/', (req, res) => {
    res.redirect("home.html")
})
// This is used to log out the different actors of portal
app.get('/logout', (req, res) => {
    req.session.loggedin = false
    req.session.username = undefined
    req.session.usertype = undefined
    res.send('Sucessfully Logged Out. Go to <a href="/">Home</a>')
})

