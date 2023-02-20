/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-17
 */
'use strict';

let JobPosting = require('./jobposting.js')
const PrimaryContract = require('./primary-contract.js');
const crypto = require('crypto');
class HRContract extends PrimaryContract {

    //Create jobposting in the ledger
    async createjobposting(ctx, args) {
        args = JSON.parse(args);

        let newjobposting = await new JobPosting(
            args.jobpostingId,
            args.HRId,
            args.profilename,
            args.qualification,
            args.agelimit,
            args.salary,
            args.location,
            args.yearofexperience,
            args.skills,
            args.companyname
        );
        const exists = await this.jobpostingExists(ctx, newjobposting.jobpostingId);
        if (exists) {
            throw new Error(`The jobposting ${newjobposting.jobpostingId} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(newjobposting));
        await ctx.stub.putState(newjobposting.jobpostingId, buffer);
    }
    //Delete jobposting from the ledger based on jobpostingId
    async deletejobposting(ctx, jobpostingId) {
        const exists = await this.jobpostingExists(ctx, jobpostingId);
        if (!exists) {
            throw new Error(`The posting ${jobpostingId} does not exist`);
        }
        await ctx.stub.deleteState(jobpostingId);
    }
    //Update as Hired
    async updateStatus(ctx, jobseekerId, jobpostingId) {
        const jobposting = await this.readJobposting(ctx, jobpostingId);
        const jobseeker = await this.readJobseeker(ctx, jobseekerId);
        if (jobseeker.appliedTo.includes(jobpostingId)) {
            jobposting.hired = crypto.createHash('sha256').update(jobseeker.jobseekerId).digest('hex');
            const buffer = Buffer.from(JSON.stringify(jobposting));
            await ctx.stub.putState(jobpostingId, buffer);
            console.log("Hired status updated")
        } else {
            console.log("Not applied for this job posting")
            throw false;
        }

    }
    //Read job posting based on HRId
    async queryJobPostingByHRId(ctx, HRId) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'jobposting';
        queryString.selector.HRId = HRId;
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());

        return asset;
    }
    //Read only allowed Job seekers by HR
    //Read jobseeker details based on jobseekerId
    async readJobseekerbyHR(ctx, jobseekerId, jobpostingId, HRId) {

        const buffer1 = await ctx.stub.getState(jobseekerId);
        let asset1 = JSON.parse(buffer1.toString());

        const buffer2 = await ctx.stub.getState(jobpostingId);
        let asset2 = JSON.parse(buffer2.toString());

        if (asset1.appliedTo.includes(jobpostingId) && asset2.HRId === HRId) {
            console.log("Allowed to View");
            asset1 = ({
                jobseekerId: asset1.jobseekerId,
                firstName: asset1.firstName,
                lastName: asset1.lastName,
                age: asset1.age,
                phoneNumber: asset1.phoneNumber,
                address: asset1.address,
                qualification: asset1.qualification,
                achievements: asset1.achievements,
                experience: asset1.experience,
                skills: asset1.skills,
                certificates: asset1.certificates
            });
            return asset1;
        }

        throw false;

    }
        //Retrieves job post history
        async getJobpostHistory(ctx, id) {
        let iterator = await ctx.stub.getHistoryForKey(id);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
        if (res.value) {
            console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
            const obj = JSON.parse(res.value.value.toString('utf8'));
            result.push(obj);
        }
        res = await iterator.next();
        }
        await iterator.close();
        return result;  
    }
}
module.exports = HRContract;