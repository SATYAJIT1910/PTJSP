/**
 * @author Satyajit Ghosh
 * @date 2022-11-27
 * @email satyajit@satyajit.co.in & satyajit.ghosh@stu.adamasuniversity.ac.in
 */

import { Router } from 'express';
let router = Router();
import { createHash } from 'crypto';
import * as blockexecute from '../blockchainExecuter';
// login page for jobseeker
router.get('/login', async (req, res) => {
    res.sendFile('/static/jobseeker/login.html', { root: '.' })
})
// job seeker credientials verification
router.post('/login/', async (req, res) => {
    console.log(req.body)
    let username = req.body.username;
    let password = createHash('sha256').update(req.body.password).digest('hex');

    try {
        let usrobj = JSON.parse(await blockexecute.readJobseeker(username))
        let usroriginalpassword = usrobj.password
        if (usroriginalpassword == password) {
            req.session.loggedin = true
            req.session.username = usrobj.jobseekerId
            res.redirect('/jobseeker/dashboard')
        } else {
            res.status(401).send("<script>window.alert('Invaild credentials');window.location.replace('/jobseeker/login')</script>");
        }
    } catch (error) {
        res.status(401).send("<script>window.alert('User not registered');window.location.replace('/jobseeker/login')</script>");
    }
})
// Register a new job seeker to the portal
router.post('/createuser', async (req, res) => {
    try {
        await blockexecute.createjobseeker(JSON.stringify(req.body));
        console.log(req.body)
        res.status(201).send('<script>window.alert("Registered Successfully");window.location.replace("/jobseeker/login")</script>'); // 201 - Created
    } catch (error) {
        res.status(409).send('<script>window.alert("User Already Exists");window.location.replace("/jobseeker/login")</script>') // 409 - Conflict
    }

})
// Dashboard for the job seeker
router.get('/dashboard', async (req, res) => {
    if (req.session.loggedin) {
        res.render('jobseeker/dashboard', { "usrdata": req.session.username })
    }else{
        res.redirect('/jobseeker/login')
    }
})
// Update a job seeker page
router.get('/editprofile/:ID', async (req, res) => {
    if (req.session.loggedin && req.session.username == req.params.ID) {
        try {

            let usrobj = JSON.parse(await blockexecute.readJobseeker(req.params.ID))
            res.render('jobseeker/update', { "data": usrobj })
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// This sends the updated record of job seeker to the blockchain
router.post('/update', async (req, res) => {
    if (req.session.loggedin && req.session.username == req.body.jobseekerId) {
        try {

            await blockexecute.updatejobseeker(JSON.stringify(req.body))
            res.status(200).send("<script>window.alert('Details Sucessfully Updated');window.location.replace('/jobseeker/dashboard/')</script>")
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// Shows full profile of job seeker
router.get('/viewfullprofile/:ID', async (req, res) => {
    if (req.session.loggedin && req.session.username == req.params.ID) {
        try {

            let data = JSON.parse(await blockexecute.readJobseeker(req.params.ID))
            res.render('jobseeker/fullprofile', { "data": data });
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// Update password page for job seeker
router.get('/updatepassword', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile('/static/jobseeker/updatepassword.html', { root: '.' })
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// Sends updated password to the blockchain
router.post('/updatepassword', async (req, res) => {
    let oldpasswd = req.body.oldpaswd;
    let newpasswd = req.body.newpaswd;
    let jobseekerId = req.session.username;
    oldpasswd = createHash('sha256').update(oldpasswd).digest('hex');
    let data = JSON.parse(await blockexecute.getjobseekerPassword(jobseekerId))
    let originalPassword = data.password;
    if (oldpasswd == originalPassword) {
        try {

            await blockexecute.updatejobseekerPassword(JSON.stringify({ "jobseekerId": jobseekerId, "newPassword": newpasswd }))
            res.status(200).send('<script>window.alert("Password Updated Successfully");window.location.replace("/jobseeker/dashboard/")</script>')  // 200 - Ok
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.send("<b>Old Password doesn't match</b>")
    }
})
// Job seeker can delete his profile
router.get('/deleteuser', async (req, res) => {
    try {
        await blockexecute.deleteJobSeeker(req.session.username, false);
        req.session.loggedin = false
        req.session.username = undefined
        res.status(200).send("<h3>User Sucessfully Deleted.<a href='/'>Back to Home</a></h3>");
    } catch (error) {
        res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
    }
})
// Job seeker searches for job
router.get('/searchjobs/', async (req, res) => {
    try {
        res.render('jobseeker/searchjob', { "data": JSON.parse(await blockexecute.queryAllJobposting()), "username": req.session.username });
    } catch (error) {
        res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
    }
})
// Job seeker searches for job with external keyword
router.get('/searchjobs/:keyword', async (req, res) => {
    try {
        res.render('jobseeker/searchjob', { "data": JSON.parse(await blockexecute.queryAllJobposting()), "username": req.session.username ,"keyword":req.params.keyword});
    } catch (error) {
        res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
    }
})
// Job seeker apply for different jobs
router.get('/apply/:JPID', async (req, res) => {

    const jobseekerId = req.session.username;
    const jobpostingId = req.params.JPID;
    if (req.session.loggedin) {
        try {

            await blockexecute.applyforjob(JSON.stringify({ "jobseekerId": jobseekerId, "jobpostingId": jobpostingId }))
            res.status(200).send("<script>window.alert('You have sucessfully Applied. Thank You');window.location.replace('/jobseeker/searchjobs/')</script>")
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.redirect("/jobseeker/login")
    }
})

export default router;