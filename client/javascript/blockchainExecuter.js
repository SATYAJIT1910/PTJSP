let contract;
const crypto = require('crypto');
const cont = require('./contract_invoke')
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function initcont() {
    // This function initializes the contract.
    contract = await cont.initContract();
    console.log(contract)
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
async function applyforjob(args) {
    await contract.submitTransaction('JobseekerContract:applyForJob', args)
    console.log('JobseekerContract:applyForJob-Transaction has been submitted');

}

// hr

async function createJobposting(obj) {
    await contract.submitTransaction('HRContract:createjobposting', JSON.stringify(obj))
    console.log('HRContract:createjobposting-Transaction has been submitted');
}
async function queryJobPostingByHRId(HRId) {
    const result = await contract.evaluateTransaction('HRContract:queryJobPostingByHRId', HRId);
    console.log(`HRContract:queryJobPostingByHRId-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function readJobseekerbyHR(jobseekerId, jobpostingId, HRId) {
    const result = await contract.evaluateTransaction('HRContract:readJobseekerbyHR', jobseekerId, jobpostingId, HRId);
    console.log(`HRContract:readJobseekerbyHR-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}
async function updateStatus(jobseekerId, jobpostingId) {
    await contract.submitTransaction('HRContract:updateStatus', jobseekerId, jobpostingId)
    console.log('HRContract:updateStatus-Transaction has been submitted');
}

module.exports={readAllJobSeeker,
    queryAllJobposting,
    deleteJobSeeker,
    deleteJobposting,
    createjobseeker,
    readJobseeker,
    updatejobseeker,
    updatejobseekerPassword,
    getjobseekerPassword,
    applyforjob,
    createJobposting,
    queryJobPostingByHRId,
    readJobseekerbyHR,
    updateStatus,
    contract,
    initcont
}