/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-17
 */
'use strict';

const adminContract = require('./lib/admin-contract.js');
const primaryContract = require('./lib/primary-contract.js');
const hrContract = require('./lib/HR-contract.js');
const jobSeekerContract=require('./lib/jobseeker-contract');

module.exports.contracts = [ primaryContract,adminContract,hrContract,jobSeekerContract];
