/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-17
 */

const crypto = require('crypto');

class JobSeeker {

    constructor(jobseekerId, firstName, lastName, password, age, phoneNumber, address)
    {
        this.docType='jobseeker';
        this.jobseekerId = jobseekerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = crypto.createHash('sha256').update(password).digest('hex');
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.qualification=[];
        this.achievements=[];
        this.experience=[];
        this.skills=[];
        this.certificates=[];
        this.pwdTemp = true;
        this.appliedTo=[];
        return this;
    }
}
module.exports = JobSeeker
