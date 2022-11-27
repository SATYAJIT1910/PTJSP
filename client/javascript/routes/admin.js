import { Router } from 'express';
let router = Router();
import * as blockexecute from '../blockchainExecuter';

// admin login
router.get('/login', (req, res) => {
    res.sendFile('/static/admin/login.html', { root: '.' })
})
// verfication of admin credentials
router.post('/login/verfify', (req, res) => {
    if (req.body.username == 'admin' && req.body.password == '1234') {
        req.session.loggedin = true;
        req.session.username = 'admin';
        res.redirect('/admin/dashboard')
    } else {
        res.send("Invaild Credientials")
    }
})
// dashboard for admin
router.get('/dashboard', (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        res.sendFile('/static/admin/dashboard.html', { root: '.' })
    } else {
        res.send("Login Required")
    }
})
// all registered job seekers view to admin
router.get('/allusers', async (req, res) => {

    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            res.render('admin/admin_all_user', { "data": JSON.parse(await blockexecute.readAllJobSeeker()) })

        } catch (error) {
            console.log(error)
            res.sendStatus(501);
        }
    } else {
        res.send("Login Required")
    }
})
// all posted job view to admin
router.get('/alljobs', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            res.render('admin/admin_all_jobs', { "data": JSON.parse(await blockexecute.queryAllJobposting()) });
        } catch (error) {
            res.sendStatus(501);
        }
    } else {
        res.send("Login Required")
    }
}
)
// delete a job seeker by admin
router.get('/deleteuser/:JSkey', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            let JSkey = req.params.JSkey;
            await blockexecute.deleteJobSeeker(JSkey, true);
            res.redirect('/admin/allusers')
        } catch (error) {
            res.sendStatus(501);
        }
    } else {
        res.send("Login Required")
    }
}
)
// delete a job post by admin
router.get('/deletejob/:jobpostingId', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {

            await blockexecute.deleteJobposting(req.params.jobpostingId, true)
            res.redirect('/admin/alljobs');
        } catch (error) {
            res.sendStatus(501);
        }
    } else {
        res.send("Login Required")
    }
})

export default router;