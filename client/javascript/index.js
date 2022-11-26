/**
 * @author Satyajit Ghosh
 * @date 2022-11-25
 */
'use strict';

let contract;
const crypto = require('crypto');
const cont = require('./contract_invoke')
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
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

async function initcont() {
    // This function initializes the contract.
    contract = await cont.initContract();
    console.log(contract)
}

// This function starts the express server
app.listen(3000, async () => {
    console.log("Started on PORT 3000");
    console.log("Server Started Successfully");
    initcont();
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
            res.render('admin/admin_all_user', { "data": JSON.parse(await readAllJobSeeker()) })

        } catch (error) {
            res.sendStatus(404);
        }
    } else {
        res.send("Login Required")
    }
})
app.get('/admin/alljobs', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            res.render('admin/admin_all_jobs', { "data": JSON.parse(await queryAllJobposting()) });
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
            await deleteJobSeeker(JSkey, true);
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

            await deleteJobposting(req.params.jobpostingId, true)
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
        let usrobj = JSON.parse(await readJobseeker(username))
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
        await createjobseeker(JSON.stringify(req.body));
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
        let usrobj = JSON.parse(await readJobseeker(req.params.ID))
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
        await updatejobseeker(JSON.stringify(req.body))
        res.send("<b>Details Sucessfully Updated <a href='/jobseeker/dashboard'>Back to Dashboard</a></b>")
    } else {
        res.send("Login Required")
    }
})
app.get('/jobseeker/viewfullprofile/:ID', async (req, res) => {
    if (req.session.loggedin && req.session.username == req.params.ID) {
        let data=JSON.parse(await readJobseeker(req.params.ID))
        res.render('jobseeker/fullprofile',{"data":data});
    } else {
        res.send("Login Required")
    }
})

app.get('/jobseeker/updatepassword/',(req,res)=>{
    if(req.session.loggedin){
        res.sendFile(path.join(__dirname + '/static/jobseeker/updatepassword.html'))
    }else{
        res.send("Login Required")
    }
})
app.post('/jobseeker/passwordupdate',async (req,res)=>{
    let oldpasswd=req.body.oldpaswd;
    let newpasswd=req.body.newpaswd;
    let jobseekerId=req.session.username;
    oldpasswd=crypto.createHash('sha256').update(oldpasswd).digest('hex');
    let data=JSON.parse(await getjobseekerPassword(jobseekerId))
    let originalPassword=data.password;
    if(oldpasswd==originalPassword){
        await updatejobseekerPassword(JSON.stringify({ "jobseekerId": jobseekerId, "newPassword": newpasswd }))
        res.send("<b>Password Sucessfully Updated</b>")
    }else{
        res.send("<b>Old Password doesn't match</b>")
    }

})



app.get('/logout', (req, res) => {
    req.session.loggedin = false
    req.session.username = undefined
    res.send('Sucessfully Logged Out. Go to <a href="/">Home</a>')
})


// Blockchain executer methods
async function readAllJobSeeker() {
    const result = await contract.evaluateTransaction('AdminContract:queryAllJobSeeker');
    console.log(`AdminContract:queryAllJobSeeker-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;

}
async function queryAllJobposting() {
    const result = await contract.evaluateTransaction('AdminContract:queryAllJobPosting');
    console.log(`AdminContract:queryAllJobPosting-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function deleteJobSeeker(JSkey, admin) {
    if (admin) {
        await contract.submitTransaction('AdminContract:deleteJobseeker', JSkey)
        console.log('AdminContract:deleteJobseeker-Transaction has been submitted');
    } else {
        await contract.submitTransaction('JobseekerContract:deleteJobseeker', JSkey)
        console.log('JobseekerContract:deleteJobseeker-Transaction has been submitted');
    }
}
async function deleteJobposting(jobpostingId, admin) {
    if (admin) {
        await contract.submitTransaction('AdminContract:deletejobposting', jobpostingId)
        console.log('AdminContract:deletejobposting-Transaction has been submitted');
    } else {
        await contract.submitTransaction('HRContract:deletejobposting', jobpostingId)
        console.log('HRContract:deletejobposting-Transaction has been submitted');
    }
}
//Jobseeker
async function createjobseeker(args) {
    await contract.submitTransaction('JobseekerContract:createjobseeker', args)
    console.log('JobseekerContract:createjobseeker-Transaction has been submitted');
}
async function readJobseeker(jobseekerId) {
    const result = await contract.evaluateTransaction('JobseekerContract:readJobseeker', jobseekerId);
    console.log(`JobseekerContract:readJobseeker-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function updatejobseeker(args) {
    await contract.submitTransaction('JobseekerContract:updatejobseeker', args)
    console.log('JobseekerContract:updatejobseeker-Transaction has been submitted');
}
async function updatejobseekerPassword(args) {
    await contract.submitTransaction('JobseekerContract:updatejobseekerPassword', args)
    console.log('JobseekerContract:updatejobseekerPassword-Transaction has been submitted');

}
async function getjobseekerPassword(jobseekerId) {
    const result = await contract.evaluateTransaction('JobseekerContract:getjobseekerPassword', jobseekerId);
    console.log(`JobseekerContract:getjobseekerPassword-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}