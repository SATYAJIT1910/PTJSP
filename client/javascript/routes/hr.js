/**
 * @author Satyajit Ghosh
 * @date 2022-11-27
 * @email satyajit@satyajit.co.in & satyajit.ghosh@stu.adamasuniversity.ac.in
 */

import { Router } from 'express';
let router = Router();
import * as blockexecute from '../blockchainExecuter';
//login for HR
router.get('/login', async (req, res) => {
    res.sendFile('/static/hr/login.html', { root: '.' })
})
// HR credientials verification
router.post('/login/', async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    // We are taking 4 fixed HR accounts for demonstration purpose
    if ((username == process.env.HR1_ID && password == process.env.HR1_KEY ||
        username == process.env.HR2_ID && password == process.env.HR2_KEY ||
        username == process.env.HR3_ID && password == process.env.HR3_KEY ||
        username == process.env.HR4_ID && password == process.env.HR4_KEY)
    ) {
        req.session.username = username
        req.session.loggedin = true
        req.session.usertype = 'hr'
        res.redirect('/hr/dashboard')
    } else {
        res.status(401).send("<script>window.alert('Invaild credentials');window.location.replace('/hr/login')</script>")
    }
})
// Dashboard for HR
router.get('/dashboard', (req, res) => {
    if (req.session.loggedin && req.session.usertype == 'hr') {
        res.sendFile('/static/hr/dashboard.html', { root: '.' })
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }

})
// Job posting page
router.get('/jobpost', (req, res) => {
    if (req.session.loggedin && req.session.usertype == 'hr') {
        res.sendFile('/static/hr/jobpost.html', { root: '.' })
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// This sends the new Job post record to Blockchain
router.post('/jobpost', async (req, res) => {
    if (req.session.loggedin && req.session.usertype == 'hr') {
        try {
            let data = req.body;
            data.HRId = req.session.username;
            await blockexecute.createJobposting(req.body);
            res.status(200).send("<script>window.alert('Job Posted Successfully');window.location.replace('/hr/jobpost/')</script>");
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }

})
// HR can view his own posted jobs
router.get('/viewposts', async (req, res) => {
    if (req.session.loggedin && req.session.usertype == 'hr') {
        try {
            let data = JSON.parse(await blockexecute.queryJobPostingByHRId(req.session.username));
            res.render('hr/postedjobs', { "data": data })
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }

    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// HR can delete a job posted by him/her
router.get('/deletejob/:jobpostingId', async (req, res) => {
    if (req.session.loggedin && req.session.usertype == 'hr') {
        try {
            await blockexecute.deleteJobposting(req.params.jobpostingId, false)
            res.redirect("/hr/viewposts");
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }

})
// HR can view the details of a candidate , only if the candidate applied for the job
router.get('/candidate/:jobpostingId/:jobseekerId', async (req, res) => {
    if (req.session.loggedin && req.session.usertype == 'hr') {
        try {
            let data = JSON.parse(await blockexecute.readJobseekerbyHR(req.params.jobseekerId, req.params.jobpostingId, req.session.username));
            res.render('hr/candidateprofile', { "data": data, "jobpostingId": req.params.jobpostingId })

        } catch (error) {
            res.status(404).send("<script>window.alert('Candidate no longer available');</script>");
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
// HR can mark one candidate as hired
router.get('/hired/:jobpostingId/:jobseekerId/', async (req, res) => {
    if (req.session.loggedin && req.session.usertype == 'hr') {
        try {
            const jobseekerId = req.params.jobseekerId;
            const jobpostingId = req.params.jobpostingId;
            await blockexecute.updateStatus(jobseekerId, jobpostingId)
            res.status(200).send("<script>window.alert('Candidate Hired Successfully');window.location.replace('/hr/viewposts/')</script>");
        } catch (error) {
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    } else {
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
router.get('/checkapplications/:jobid',async (req,res)=>{
    if (req.session.loggedin && req.session.usertype == 'hr'){
        try{
            let jobid=req.params.jobid;
            let data = JSON.parse(await blockexecute.queryJobPostingByHRId(req.session.username));
            let newdata;
            console.log(jobid)
            console.log(data)
            for(let i=0;i<data.length;i++){
               // console.log(data.Key)
                if(data[i].Key==jobid){
                     newdata = data[i].Record.appliedCandidates
                    // console.log(newdata)
                     //res.json(newdata)
                     res.render('hr/candidateapplications', { "data": newdata, "jobpostingId": jobid })
                }
            }
        }catch(error){
            res.status(500).sendFile('500.html', { root: 'public/errorpages' }) // 500 - Internal Server Error
        }
    }else{
        res.status(401).sendFile('401.html', { root: 'public/errorpages' }) // 401 - Unauthorized
    }
})
export default router;