/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-17
 */
'use strict';
const PrimaryContract = require('./primary-contract.js');

class AdminContract extends PrimaryContract{

    //Delete jobseeker from the ledger based on jobseekerId
    async deleteJobseeker(ctx, jobseekerId) {
        const exists = await this.jobseekerExists(ctx, jobseekerId);
        if (!exists) {
            throw new Error(`The jobseeker ${jobseekerId} does not exist`);
        }
        await ctx.stub.deleteState(jobseekerId);
    }
    //Delete jobposting from the ledger based on jobpostingId
    async deletejobposting(ctx, jobpostingId) {
        const exists = await this.jobpostingExists(ctx, jobpostingId);
        if (!exists) {
            throw new Error(`The jobseeker ${jobpostingId} does not exist`);
        }
        await ctx.stub.deleteState(jobpostingId);
    }
    //Read all job posting
    async queryAllJobPosting(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'jobposting';
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        let asset = JSON.parse(buffer.toString());
        return asset;
    }
    //Read all job seeker
    async queryAllJobSeeker(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'jobseeker';
        const buffer = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        //only basic details
        let asset = JSON.parse(buffer.toString());
        
        for (let i=0;i<asset.length;i++){
            let obj = asset[i];
            delete obj.Record.password
            delete obj.Record.appliedTo
            delete obj.Record.certificates
            delete obj.Record.pwdTemp
            delete obj.Record.skills
            delete obj.Record.achievements
            delete obj.Record.docType
            delete obj.Record.experience
            delete obj.Record.qualification
        }
        
        return asset;
    }


}
module.exports = AdminContract;
