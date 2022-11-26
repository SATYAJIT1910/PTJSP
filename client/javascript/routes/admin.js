var express = require('express');
var router = express.Router();
const path = require('path');
const crypto = require('crypto');
const blockexecute=require('../blockchainExecuter')

router.get('/login', (req, res) => {
    res.sendFile('/static/admin/login.html',{ root: '.' })
})
router.post('/login/verfify', (req, res) => {
    console.log(req.body)
    if (req.body.username == 'admin' && req.body.password == '1234') {
        req.session.loggedin = true;
        req.session.username = 'admin';
        res.redirect('/admin/dashboard')
    } else {
        res.send("Invaild Credientials")
    }
})
router.get('/dashboard', (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        res.sendFile('/static/admin/dashboard.html',{ root: '.' })
    } else {
        res.send("Login Required")
    }
})
router.get('/allusers', async (req, res) => {

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
router.get('/alljobs', async (req, res) => {
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

router.get('/deleteuser/:JSkey', async (req, res) => {
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

router.get('/deletejob/:jobpostingId', async (req, res) => {
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

module.exports = router;