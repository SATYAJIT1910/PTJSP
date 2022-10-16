/**
 * @author Satyajit Ghosh
 * @date 2022-09-17
 */
'use strict';

let contract;
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
// ============= GET METHODS ================================
app.get('/admin/allusers', async (req, res) => {
    try {
        res.json(JSON.parse(await readAllJobSeeker()));
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/admin/alljobs', async (req, res) => {
    try {
        res.json(JSON.parse(await queryAllJobposting()));
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/HR/usrhistory/:jobseekerId', async (req, res) => {
    try {
        res.json(JSON.parse(await getjobseekerHistory(req.params.jobseekerId)));
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/HR/queryjob/:HRId', async (req, res) => {
    try {
        res.json(JSON.parse(await queryJobPostingByHRId(req.params.HRId)));
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/user/:jobseekerId', async (req, res) => {
    try {
        res.json(JSON.parse(await readJobseeker(req.params.jobseekerId)));
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/userpw/:jobseekerId', async (req, res) => {
    try {
        res.json(JSON.parse(await getjobseekerPassword(req.params.jobseekerId)));
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/HR/user/:jobseekerId/:jobpostingId/:HRId', async (req, res) => {
    try {
        res.json(JSON.parse(await readJobseekerbyHR(req.params.jobseekerId, req.params.jobpostingId, req.params.HRId)));
    } catch (error) {
        res.sendStatus(404);
    }
})
// =================== POST METHODS ============================
app.post('/createuser', async (req, res) => {
    try {
        await createjobseeker(JSON.stringify(req.body));
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }

})
app.post('/admin/deleteuser', async (req, res) => {
    try {
        let JSkey = req.body.deleteusr;
        await deleteJobSeeker(JSkey, true);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
})
app.post('/deleteuser', async (req, res) => {
    try {
        let JSkey = req.body.deleteusr;
        await deleteJobSeeker(JSkey, false);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
})
app.post('/HR/createjob', async (req, res) => {
    try {
        await createJobposting(req.body);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
})
app.post('/admin/deletejob', async (req, res) => {
    try {

        await deleteJobposting(req.body.jobpostingId, true)
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
})
app.post('/HR/deletejob', async (req, res) => {
    try {

        await deleteJobposting(req.body.jobpostingId, false)
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
})
app.post('/HR/updatestatus/:jobseekerId/:jobpostingId', async (req, res) => {
    try {
        const jobseekerId = req.params.jobseekerId;
        const jobpostingId = req.params.jobpostingId;
        await updateStatus(jobseekerId, jobpostingId)
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(400);
    }
})
app.post('/applyforjob/:jobpostingId/:jobseekerId', async (req, res) => {
    try {

        const jobseekerId = req.params.jobseekerId;
        const jobpostingId = req.params.jobpostingId;
        await applyforjob(JSON.stringify({ "jobseekerId": jobseekerId, "jobpostingId": jobpostingId }))
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(400)
    }
})
app.post('/updateuserpw/:jobseekerId/:newPassword', async (req, res) => {
    try {
        const jobseekerId = req.params.jobseekerId;
        const newPassword = req.params.newPassword;
        await updatejobseekerPassword(JSON.stringify({ "jobseekerId": jobseekerId, "newPassword": newPassword }))
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(400)
    }
})
app.post('/updateuser', async (req, res) => {
    try {
        await updatejobseeker(JSON.stringify(req.body))
        res.sendStatus(201)
    } catch (error) {
        res.sendStatus(400)
    }
})
//============================================================
app.listen(3000, async () => {
    console.log("Started on PORT 3000");
    contract = await main();
    console.log(contract);
    console.log("Server Started Successfully");
})


async function main() {
    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log('An identity for the user "appUser" does not exist in the wallet');
        console.log('Run the registerUser.js application before retrying');
        return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract = network.getContract('ptjsp');
    return contract;
}
async function createjobseeker(args) {
    await contract.submitTransaction('JobseekerContract:createjobseeker', args)
    console.log('JobseekerContract:createjobseeker-Transaction has been submitted');
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
async function createJobposting(obj) {
    await contract.submitTransaction('HRContract:createjobposting', JSON.stringify(obj))
    console.log('HRContract:createjobposting-Transaction has been submitted');
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
async function updateStatus(jobseekerId, jobpostingId) {
    await contract.submitTransaction('HRContract:updateStatus', jobseekerId, jobpostingId)
    console.log('HRContract:updateStatus-Transaction has been submitted');
}
async function applyforjob(args) {
    await contract.submitTransaction('JobseekerContract:applyForJob', args)
    console.log('JobseekerContract:applyForJob-Transaction has been submitted');

}
async function updatejobseekerPassword(args) {
    await contract.submitTransaction('JobseekerContract:updatejobseekerPassword', args)
    console.log('JobseekerContract:updatejobseekerPassword-Transaction has been submitted');

}
async function updatejobseeker(args) {
    await contract.submitTransaction('JobseekerContract:updatejobseeker', args)
    console.log('JobseekerContract:updatejobseeker-Transaction has been submitted');
}
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
async function queryJobPostingByHRId(HRId) {
    const result = await contract.evaluateTransaction('HRContract:queryJobPostingByHRId', HRId);
    console.log(`HRContract:queryJobPostingByHRId-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function readJobseeker(jobseekerId) {
    const result = await contract.evaluateTransaction('JobseekerContract:readJobseeker', jobseekerId);
    console.log(`JobseekerContract:readJobseeker-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function getjobseekerPassword(jobseekerId) {
    const result = await contract.evaluateTransaction('JobseekerContract:getjobseekerPassword', jobseekerId);
    console.log(`JobseekerContract:getjobseekerPassword-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function readJobseekerbyHR(jobseekerId, jobpostingId, HRId) {
    const result = await contract.evaluateTransaction('HRContract:readJobseekerbyHR', jobseekerId, jobpostingId, HRId);
    console.log(`HRContract:readJobseekerbyHR-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function getjobseekerHistory(jobseekerId) {
    const result = await contract.evaluateTransaction('HRContract:getjobseekerHistory', jobseekerId);
    console.log(`HRContract:getjobseekerHistory-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
