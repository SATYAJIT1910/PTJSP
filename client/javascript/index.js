/**
 * @author Satyajit Ghosh
 * @date 2022-11-25
 */
'use strict';

let contract;
const crypto = require('crypto');
const blockexecute=require('./blockchainExecuter')
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
////


// This function starts the express server
app.listen(3000, async () => {
    console.log("Started on PORT 3000");
    console.log("Server Started Successfully");
    blockexecute.initcont();
})
// root
app.get('/', (req, res) => {
    res.redirect("home.html")
})
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/admin/login.html'))
})
app.post('/admin/login/verfify', (req, res) => {
    console.log(req.body)
    if (req.body.username == 'admin' && req.body.password == '1234') {
        req.session.loggedin = true;
        req.session.username = 'admin';
        res.redirect('/admin/dashboard')
    } else {
        res.send("Invaild Credientials")
    }
})
app.get('/admin/dashboard', (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        res.sendFile(path.join(__dirname + '/static/admin/dashboard.html'))
    } else {
        res.send("Login Required")
    }
})
app.get('/admin/allusers', async (req, res) => {

    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            res.render('admin/admin_all_user', { "data": JSON.parse(await blockexecute.readAllJobSeeker()) })

        } catch (error) {
            res.sendStatus(error);
        }
    } else {
        res.send("Login Required")
    }
})
app.get('/admin/alljobs', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            res.render('admin/admin_all_jobs', { "data": JSON.parse(await blockexecute.queryAllJobposting()) });
        } catch (error) {
            res.sendStatus(404);
        }
    } else {
        res.send("Login Required")
    }
}
)

app.get('/admin/deleteuser/:JSkey', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            let JSkey = req.params.JSkey;
            await blockexecute.deleteJobSeeker(JSkey, true);
            res.redirect('/admin/allusers')
        } catch (error) {
            res.sendStatus(400);
        }
    } else {
        res.send("Login Required")
    }
}
)

app.get('/admin/deletejob/:jobpostingId', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {

            await blockexecute.deleteJobposting(req.params.jobpostingId, true)
            res.redirect('/admin/alljobs');
        } catch (error) {
            res.sendStatus(400);
        }
    } else {
        res.send("Login Required")
    }
})
//jobseeker
app.get('/jobseeker/login', async (req, res) => {
    res.sendFile(path.join(__dirname + '/static/jobseeker/login.html'))
})
app.post('/jobseeker/login/verfify', async (req, res) => {
    console.log(req.body)
    let username = req.body.username;
    let password = crypto.createHash('sha256').update(req.body.password).digest('hex');

    try {
        let usrobj = JSON.parse(await blockexecute.readJobseeker(username))
        let usroriginalpassword = usrobj.password
        if (usroriginalpassword == password) {
            req.session.loggedin = true
            req.session.username = usrobj.jobseekerId
            res.redirect('/jobseeker/dashboard')
        } else {
            res.send("Invaild Credientials");
        }
    } catch {
        res.send("User Doesn't Exits");
    }
})

app.post('/createuser', async (req, res) => {
    try {
        await blockexecute.createjobseeker(JSON.stringify(req.body));
        console.log(req.body)
        res.send('Job Seeker Created Successfully. Back to <a href="/jobseeker/login">Login</a>');
    } catch (error) {
        res.sendStatus(400);
    }

})
app.get('/jobseeker/dashboard', async (req, res) => {
    if (req.session.loggedin) {
        res.render('jobseeker/dashboard', { "usrdata": req.session.username })
    }
})

app.get('/jobseeker/editprofile/:ID', async (req, res) => {
    if (req.session.loggedin && req.session.username == req.params.ID) {
        let usrobj = JSON.parse(await blockexecute.readJobseeker(req.params.ID))
        console.log("The data passed is -> ")
        console.log(usrobj)
        console.log("\n\n")
        res.render('jobseeker/update', { "data": usrobj })
    } else {
        res.send("Login Required")
    }
})
app.post('/jobseeker/update', async (req, res) => {
    if (req.session.loggedin && req.session.username == req.body.jobseekerId) {
        console.log(req.body)
        await blockexecute.updatejobseeker(JSON.stringify(req.body))
        res.send("<b>Details Sucessfully Updated <a href='/jobseeker/dashboard'>Back to Dashboard</a></b>")
    } else {
        res.send("Login Required")
    }
})
app.get('/jobseeker/viewfullprofile/:ID', async (req, res) => {
    if (req.session.loggedin && req.session.username == req.params.ID) {
        let data = JSON.parse(await blockexecute.readJobseeker(req.params.ID))
        res.render('jobseeker/fullprofile', { "data": data });
    } else {
        res.send("Login Required")
    }
})

app.get('/jobseeker/updatepassword/', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/static/jobseeker/updatepassword.html'))
    } else {
        res.send("Login Required")
    }
})
app.post('/jobseeker/passwordupdate', async (req, res) => {
    let oldpasswd = req.body.oldpaswd;
    let newpasswd = req.body.newpaswd;
    let jobseekerId = req.session.username;
    oldpasswd = crypto.createHash('sha256').update(oldpasswd).digest('hex');
    let data = JSON.parse(await blockexecute.getjobseekerPassword(jobseekerId))
    let originalPassword = data.password;
    if (oldpasswd == originalPassword) {
        await blockexecute.updatejobseekerPassword(JSON.stringify({ "jobseekerId": jobseekerId, "newPassword": newpasswd }))
        res.send("<b>Password Sucessfully Updated</b>")
    } else {
        res.send("<b>Old Password doesn't match</b>")
    }
})

app.get('/jobseeker/deleteuser', async (req, res) => {
    await blockexecute.deleteJobSeeker(req.session.username, false);
    req.session.loggedin = false
    req.session.username = undefined
    res.send("User Deleted.<a href='/'>Back to Home</a>");
})
app.get('/jobseeker/searchjobs/', async (req, res) => {
    try {
        res.render('jobseeker/searchjob', { "data": JSON.parse(await blockexecute.queryAllJobposting()), "username": req.session.username });
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/jobseeker/apply/:JPID', async (req, res) => {

    const jobseekerId = req.session.username;
    const jobpostingId = req.params.JPID;
    if (req.session.loggedin) {
        await blockexecute.applyforjob(JSON.stringify({ "jobseekerId": jobseekerId, "jobpostingId": jobpostingId }))
        res.send("You have sucessfully Applied. Thank You")
    } else {
        res.redirect("/jobseeker/login")
    }
})

// hr
app.get('/hr/login', async (req, res) => {
    res.sendFile(path.join(__dirname + '/static/hr/login.html'))
})
app.post('/hr/login/verfify', async (req, res) => {
    let username=req.body.username
    let password=req.body.password

    if((username=='HR1' ||
    username=='HR2' ||
    username=='HR3' ||
    username=='HR4') 
    && password=='1234'){
        req.session.username=username
        req.session.loggedin=true
        req.session.usertype='hr'
        res.redirect('/hr/dashboard')
    }else{
        res.send("Invaild Credientials")
    }
})
app.get('/hr/dashboard',(req,res)=>{
    if(req.session.loggedin && req.session.usertype=='hr'){
        res.sendFile(path.join(__dirname + '/static/hr/dashboard.html'))
    }else{
        res.send("Login Required")
    }

})
app.get('/hr/jobpost',(req,res)=>{
    if(req.session.loggedin && req.session.usertype=='hr'){
    res.sendFile(path.join(__dirname + '/static/hr/jobpost.html'))
    }else{
        res.send("Login Required")
    }
})
app.post('/hr/createjob', async (req, res) => {
    try {
        let data=req.body;
        data.HRId=req.session.username;
        await blockexecute.createJobposting(req.body);
        res.send("Job Posted Successfully");
    } catch (error) {
        res.sendStatus(400);
    }
})
app.get('/hr/viewposts',async(req,res)=>{
    if(req.session.loggedin && req.session.usertype=='hr'){
        try {
            let data=JSON.parse(await blockexecute.queryJobPostingByHRId(req.session.username));
            res.render('hr/postedjobs',{"data":data})
        } catch (error) {
            res.sendStatus(404);
        }
        
    }else{
        res.send("Login Required")
    }
})

app.get('/hr/deletejob/:jobpostingId', async (req, res) => {
    try {
        await blockexecute.deleteJobposting(req.params.jobpostingId, false)
        res.redirect("/hr/viewposts");
    } catch (error) {
        res.sendStatus("Failed to Delete");
    }
})

app.get('/hr/candidate/:jobpostingId/:jobseekerId',async (req,res)=>{
    try{
        let data=JSON.parse(await blockexecute.readJobseekerbyHR(req.params.jobseekerId, req.params.jobpostingId, req.session.username));
        res.render('hr/candidateprofile',{"data":data,"jobpostingId":req.params.jobpostingId})
        
    }catch(error){
        console.log(error)
    }
})
app.get('/hr/hired/:jobpostingId/:jobseekerId/', async (req, res) => {
    try {
        const jobseekerId = req.params.jobseekerId;
        const jobpostingId = req.params.jobpostingId;
        await blockexecute.updateStatus(jobseekerId, jobpostingId)
        res.send("<b>Candidate Hired Successfully</b>");
    } catch (error) {
        res.sendStatus(400);
    }
})

app.get('/logout', (req, res) => {
    req.session.loggedin = false
    req.session.username = undefined
    req.session.usertype = undefined
    res.send('Sucessfully Logged Out. Go to <a href="/">Home</a>')
})

