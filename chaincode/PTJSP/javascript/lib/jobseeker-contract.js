/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-17
 */
'use strict';
let Jobseeker = require('./jobseeker.js');
const crypto = require('crypto');
const PrimaryContract = require('./primary-contract.js');
const { Context } = require('fabric-contract-api');

class JobseekerContract extends PrimaryContract {

    // Create a jobseeker
    async createjobseeker(ctx, args) {
        args = JSON.parse(args);
        console.log("creating job seeker");
        console.log(args);
        if (args.password === null || args.password === '') {
            throw new Error(`Empty or null values should not be passed for password parameter`);
        }

        let newjobseeker = new Jobseeker(
            args.jobseekerId,
            args.firstName,
            args.lastName,
            args.password,
            args.age,
            args.phoneNumber,
            args.address
        );
        const exists = await this.jobseekerExists(ctx, newjobseeker.jobseekerId);
        if (exists) {
            throw new Error(`The jobseeker ${newjobseeker.jobseekerId} already exists`);
        }
        const buffer = Buffer.from(JSON.stringify(newjobseeker));
        await ctx.stub.putState(newjobseeker.jobseekerId, buffer);
    }
    async updatejobseeker(ctx,args) {
        args = JSON.parse(args);
        let jobseekerId=args.jobseekerId;
        console.log("updating job seeker")
        console.log(args)
        const updatedjobseeker = await this.readJobseeker(ctx, jobseekerId);

        if(args.qualification !=''){
            updatedjobseeker.qualification=args.qualification;
        }
        if(args.achievements !=''){
            updatedjobseeker.achievements=args.achievements;
        }
        if(args.experience !=''){
            updatedjobseeker.experience=args.experience;
        }
        if(args.skills!=''){
            updatedjobseeker.skills=args.skills;
        }
        if(args.certificates!=''){
            updatedjobseeker.certificates=args.certificates;
        }
        if(args.firstName!=''){
            updatedjobseeker.firstName=args.firstName;
        }
        if(args.lastName!=''){
            updatedjobseeker.lastName=args.lastName;
        }

        if (await this.jobseekerExists(ctx, jobseekerId)) {
            const buffer = Buffer.from(JSON.stringify(updatedjobseeker));
            await ctx.stub.putState(jobseekerId, buffer);

        }else{
            throw new Error(`The jobseeker ${jobseekerId} does not exist`);
        }

    }

    //Read jobseeker details based on jobseekerId
    async readJobseeker(ctx, jobseekerId) {
        return await super.readJobseeker(ctx, jobseekerId);
    }

    //Delete jobseeker from the ledger based on jobseekerId
    async deleteJobseeker(ctx, jobseekerId) {
        const exists = await this.jobseekerExists(ctx, jobseekerId);
        if (!exists) {
            throw new Error(`The jobseeker ${jobseekerId} does not exist`);
        }
        await ctx.stub.deleteState(jobseekerId);
    }

    //This function is to update jobseeker password. This function should be called by jobseeker.
    async updatejobseekerPassword(ctx, args) {
        args = JSON.parse(args);
        let jobseekerId = args.jobseekerId;
        let newPassword = args.newPassword;

        if (newPassword === null || newPassword === '') {
            throw new Error(`Empty or null values should not be passed for newPassword parameter`);
        }

        const jobseeker = await this.readJobseeker(ctx, jobseekerId);
        jobseeker.password = crypto.createHash('sha256').update(newPassword).digest('hex');
        if (jobseeker.pwdTemp) {
            jobseeker.pwdTemp = false;
        }
        const buffer = Buffer.from(JSON.stringify(jobseeker));
        await ctx.stub.putState(jobseekerId, buffer);
    }

    //Returns the jobseeker's password
    async getjobseekerPassword(ctx, jobseekerId) {
        let jobseeker = await this.readJobseeker(ctx, jobseekerId);
        jobseeker = ({
            password: jobseeker.password,
            pwdTemp: jobseeker.pwdTemp
        })
        return jobseeker;
    }

    async applyForJob(ctx, args) {
        args = JSON.parse(args);
        let jobpostingId = args.jobpostingId;
        let jobseekerId = args.jobseekerId;

        // Get the jobseeker asset from world state
        const jobseeker = await this.readJobseeker(ctx, jobseekerId);
        // Get the jobposting asset from world state
        const jobposting = await this.readJobposting(ctx, jobpostingId);

        if (!jobseeker.appliedTo.includes(jobpostingId)) {
            jobseeker.appliedTo.push(jobpostingId);
            jobposting.appliedCandidates.push(jobseekerId);

            const buffer = Buffer.from(JSON.stringify(jobseeker));
            // Update the ledger with updated applied job
            await ctx.stub.putState(jobseekerId, buffer);
            await ctx.stub.putState(jobpostingId, Buffer.from(JSON.stringify(jobposting)));
        }
    }
}
module.exports = JobseekerContract;
