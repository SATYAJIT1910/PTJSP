/**
 * @author Satyajit Ghosh
 * @date 2022-11-27
 * @email satyajit@satyajit.co.in & satyajit.ghosh@stu.adamasuniversity.ac.in
 */

import {initcont} from './blockchainExecuter';
import { join } from 'path';
import express from "express";
const app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
import { urlencoded, json } from "body-parser";
app.use(urlencoded({ extended: true }));
app.use(json());
//Static files serve Middleware
app.use(express.static(join(__dirname, 'static')));
// Public
app.use(express.static('public'));
// Session-management
import session from 'express-session';
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
import admin from './routes/admin.js';
import hr from './routes/hr.js';
import jobseeker from './routes/jobseeker.js';

app.use('/admin', admin);
app.use('/jobseeker', jobseeker);
app.use('/hr', hr);
////

// This starts the express server
app.listen(3000, async () => {
    console.log("Started on PORT 3000");
    console.log("Server Started Successfully");
    initcont();
})
// root directory
app.get('/', (req, res) => {
    res.redirect("home.html")
})
app.post('/',(req,res)=>{
    console.log(req.body.jobkeyword)
    res.redirect('/jobseeker/searchjobs/?value='+req.body.jobkeyword)
})
// This is used to log out the different actors of portal
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('<h3>Sucessfully Logged Out. Go to <a href="/">Home</a></h3>')
})
app.get('/about', (req, res) => {
    res.redirect("about_page.html")
})
// Fall back page
app.get('*',(req,res)=>{
    res.status(404).sendFile('404.html', { root: 'public/errorpages' })
})