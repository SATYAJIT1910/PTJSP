/**
 * @author Satyajit Ghosh
 * @date 2022-11-27
 * @email satyajit@satyajit.co.in & satyajit.ghosh@stu.adamasuniversity.ac.in
 */

import { Router } from 'express';
let router = Router();
import * as blockexecute from '../blockchainExecuter';
import dotenv from 'dotenv'
dotenv.config()

// admin login page
router.get('/login', (req, res) => {
    res.sendFile('/static/admin/login.html', { root: '.' })
})
// verfication of admin credentials
router.post('/login/', (req, res) => {
    if (req.body.username == process.env.ADMIN_ID && req.body.password == process.env.ADMIN_KEY) {
        req.session.loggedin = true;
        req.session.username = 'admin';
        res.redirect('/admin/dashboard')
    } else {
        res.status(401).send("<script>window.alert('Invaild credentials');window.location.replace('/admin/login')</script>")
    }
})
// dashboard for admin
router.get('/dashboard', (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        res.sendFile('/static/admin/dashboard.html', { root: '.' })
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// all registered job seekers view to admin
router.get('/allusers', async (req, res) => {

    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            res.render('admin/admin_all_user', { "data": JSON.parse(await blockexecute.readAllJobSeeker()) })

        } catch (error) {
            console.log(error)
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// all posted job view to admin
router.get('/alljobs', async (req, res) => {
    if (req.session.loggedin && req.session.username == 'admin') {
        try {
            res.render('admin/admin_all_jobs', { "data": JSON.parse(await blockexecute.queryAllJobposting()) });
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
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
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
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
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})

export default router;