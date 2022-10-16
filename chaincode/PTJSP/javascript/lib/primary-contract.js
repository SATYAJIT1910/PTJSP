/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-17
 */
'use strict';
const { Contract } = require('fabric-contract-api');
let Jobseeker = require('./jobseeker.js');

class PrimaryContract extends Contract{
async initLedger(ctx) {
    console.info('============= Initialize Ledger ===========');
}


    //Read jobseeker details based on jobseekerId
    async readJobseeker(ctx, jobseekerId) {
        const exists = await this.jobseekerExists(ctx, jobseekerId);
        if (!exists) {
            throw new Error(`The jobseeker ${jobseekerId} does not exist`);
        }

        const buffer = await ctx.stub.getState(jobseekerId);
        let asset = JSON.parse(buffer.toString());
        return asset;
    }
    async jobseekerExists(ctx, jobseekerId) {
        const buffer = await ctx.stub.getState(jobseekerId);
        return (!!buffer && buffer.length > 0);
    }
    // Read jobposting details based on jobpostingId
    async readJobposting(ctx, jobpostingId) {
        const exists = await this.jobpostingExists(ctx, jobpostingId);
        if (!exists) {
            throw new Error(`The jobseeker ${jobpostingId} does not exist`);
        }

        const buffer = await ctx.stub.getState(jobpostingId);
        let asset = JSON.parse(buffer.toString());
        return asset;
    }
    async jobpostingExists(ctx, jobpostingId) {
        const buffer = await ctx.stub.getState(jobpostingId);
        return (!!buffer && buffer.length > 0);
    }
    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        console.info('getQueryResultForQueryString <--> ', resultsIterator);
        let results = await this.getAllJobseekerResults(resultsIterator, false);
        return JSON.stringify(results);
    }

    async getAllJobseekerResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.Timestamp = res.value.timestamp;
                }
                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
}
module.exports = PrimaryContract;
