/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-17
 */

class JobPosting {

    constructor(jobpostingId,HRId, profilename, qualification,agelimit, salary,location,yearofexperience,skills,companyname)
    {
        this.docType='jobposting';
        this.jobpostingId = jobpostingId;
        this.HRId = HRId;
        this.profilename = profilename;
        this.qualification = qualification;
        this.agelimit = agelimit;
        this.salary = salary;
        this.location = location;
        this.yearofexperience=yearofexperience;
        this.skills=skills;
        this.companyname=companyname;
        this.hired='';
        this.appliedCandidates=[]
        return this;
    }
}
module.exports = JobPosting
