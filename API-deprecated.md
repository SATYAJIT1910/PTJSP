# PTJSP API Endpoints
<b>GET</b>: It returns 200 (OK) on success & 404 (NOT FOUND) on failure


<b>POST</b>: It returns 201 (Created) on success & 400 (Bad Request) on failure
## Admin

<hr>
GET
<hr>
<code>/admin/allusers</code>
<hr>
It is used to fetch basic details of all the registered job seekers.

### Sample Output

```
[
    {
        "Key": "JS1",
        "Record": {
            "address": "Burdwan",
            "age": "20",
            "firstName": "Satyajit",
            "jobseekerId": "JS1",
            "lastName": "Ghosh",
            "phoneNumber": "947575xxxx"
        }
    },
    {
        "Key": "JS2",
        "Record": {
            "address": "Kolkata",
            "age": "19",
            "firstName": "Aratrika",
            "jobseekerId": "JS2",
            "lastName": "Bose",
            "phoneNumber": "869403xxxx"
        }
    }
]
```

<hr>
GET
<hr>
<code>/admin/alljobs</code>
<hr>
It is used to fetch details of all the registered job postings.

### Sample Output

```
[
    {
        "Key": "JP3",
        "Record": {
            "HRId": "HR1",
            "agelimit": "25",
            "appliedCandidates": [],
            "companyname": "Amazon",
            "docType": "jobposting",
            "hired": "",
            "jobpostingId": "JS3",
            "location": "Kolkata",
            "profilename": "Software Engineer",
            "qualification": "BCA",
            "salary": "50000",
            "skills": "Java, Python",
            "yearofexperience": "0-2"
        }
    },
    {
        "Key": "JP1",
        "Record": {
            "HRId": "HR1",
            "agelimit": "35",
            "appliedCandidates": [
                "JS1"
            ],
            "companyname": "TCS",
            "docType": "jobposting",
            "hired": "JS1",
            "jobpostingId": "JP1",
            "location": "Delhi",
            "profilename": "Applied Scientist",
            "qualification": "PhD",
            "salary": "100000",
            "skills": "Machine Learning",
            "yearofexperience": "5"
        }
    }
]
```
<hr>
POST
<hr>
<code>/admin/deletejob</code>
<hr>
It is used to delete a job posting

### Sample Input

x-www-form-urlencoded key

<ul><li>jobpostingId : It takes jobpostingId</ul> 
<hr>
POST
<hr>
<code>/admin/deleteuser</code>
<hr>
It is used to delete a job seeker

### Sample Input

x-www-form-urlencoded key

<ul><li>deleteusr : It takes the JobseekerID</ul> 

## Job Seeker
<hr>
POST
<hr>
<code>/createuser</code>
<hr>
It is used to create a job seeker

### Sample Input

x-www-form-urlencoded key

<ul>
<li>jobseekerId  </li>
<li>firstName  </li>
<li>lastName  </li>
<li>password </li>
<li>age  </li>
<li>phoneNumber </li>
<li>address </li>
</ul> 

<hr>
POST
<hr>
<code>/updateuser</code>
<hr>
It is used to update a job seeker

### Sample Input

x-www-form-urlencoded key

<ul>
<li>qualification</li>
<li>achievements</li>
<li>experience</li>
<li>skills</li>
<li>certificates</li>
<li>firstName</li>
<li>lastName</li>
<li>jobseekerId</li>
</ul>

<hr>
GET
<hr>
<code>/user/:jobseekerId</code>
<hr>
It is used to read a job seeker information

### Sample Output
```
{
    "achievements": [],
    "address": "Kolkata",
    "age": "19",
    "appliedTo": ["JP1","JP2"],
    "certificates": [],
    "docType": "jobseeker",
    "experience": [],
    "firstName": "Satyajit",
    "jobseekerId": "JS2",
    "lastName": "Ghosh",
    "password": "138d9e809e386a7b800791d1f664f56d1c55f3d1ba411b950862729bc486c5ce",
    "phoneNumber": "23452342",
    "pwdTemp": true,
    "qualification": [],
    "skills": []
}
```

<hr>
POST
<hr>
<code>/deleteuser</code>
<hr>
It is used to delete a job seeker

### Sample Input

x-www-form-urlencoded key
<ul>
<li>deleteusr</li>
</ul>

<hr>
POST
<hr>
<code>/updateuserpw/:jobseekerId/:newPassword</code>
<hr>
It is used to update password of a job seeker

<hr>
GET
<hr>
<code>/userpw/:jobseekerId</code>
<hr>
It is used to get password of a job seeker

### Sample Output

```
{
    "password": "ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f",
    "pwdTemp": false
}
```

<hr>
POST
<hr>
<code>/applyforjob/:jobpostingId/:jobseekerId</code>
<hr>
It is used to apply for a job

## HR

<hr>
POST
<hr>
<code>/HR/createjob</code>
<hr>
It is used to create a job

### Sample Input

x-www-form-urlencoded key
<ul>
<li>jobpostingId</li>
<li>HRId</li>
<li>profilename</li>
<li>qualification</li>
<li>agelimit</li>
<li>salary</li>
<li>location</li>
<li>yearofexperience</li>
<li>skills</li>
<li>companyname</li>
</ul>

<hr>
GET
<hr>
<code>/HR/queryjob/:HRId</code>
<hr>
It is used to search all jobs posted by a HR 

### Sample Output
```
[
    {
        "Key": "JP2",
        "Record": {
            "HRId": "HR1",
            "agelimit": "35",
            "appliedCandidates": [
                "JS1"
            ],
            "companyname": "TCS",
            "docType": "jobposting",
            "hired": "",
            "jobpostingId": "JP2",
            "location": "Delhi",
            "profilename": "Applied Scientist",
            "qualification": "PhD",
            "salary": "100000",
            "skills": "Machine Learning",
            "yearofexperience": "5"
        }
    }
]
```
<hr>
GET
<hr>
<code>/HR/user/:jobseekerId/:jobpostingId/:HRId</code>
<hr>
It is used to read a candidate details by a HR , only if he applied for that job.


### Sample Output

```
{
    "jobseekerId": "JS1",
    "firstName": "Satyajit",
    "lastName": "Ghosh",
    "age": "21",
    "phoneNumber": "860930485",
    "address": "Katwa",
    "qualification": "MCA",
    "achievements": "Highest CGPA Holder",
    "experience": "Technical Content Writer",
    "skills": "BlockChain",
    "certificates": "Google IT Support Certified"
}
```
<hr>
POST
<hr>
<code>/HR/updatestatus/:jobseekerId/:jobpostingId</code>
<hr>
It is used to update the status of a job posting with hired candidate details.

```
"hired": "JS2",
```

<hr>
POST
<hr>
<code>/HR/deletejob</code>
<hr>
It is used to delete a jobposting by HR

### Sample Input

x-www-form-urlencoded key
<ul>
<li>jobpostingId</li>
</ul>


<hr>
GET
<hr>
<code>/HR/usrhistory/:jobseekerId</code>
<hr>
It is used to get history of a job seeker

### Sample Output

```
[
    {
        "firstName": "Satyajit",
        "lastName": "Ghosh",
        "age": "20",
        "address": "Katwa",
        "phoneNumber": "9475757575",
        "qualification": "PhD",
        "achievements": "Highest CGPA Holder",
        "experience": "Technical Content Writer",
        "skills": "BlockChain",
        "certificates": "Google IT Support Certified",
        "Timestamp": {
            "seconds": {
                "low": 1663177498,
                "high": 0,
                "unsigned": false
            },
            "nanos": 690000000
        }
    },
    {
        "firstName": "Satyajit",
        "lastName": "Ghosh",
        "age": "20",
        "address": "Katwa",
        "phoneNumber": "9475757575",
        "qualification": "MCA",
        "achievements": "Highest CGPA Holder",
        "experience": "Technical Content Writer",
        "skills": "BlockChain",
        "certificates": "Google IT Support Certified",
        "Timestamp": {
            "seconds": {
                "low": 1663177486,
                "high": 0,
                "unsigned": false
            },
            "nanos": 305000000
        }
    },
    {
        "firstName": "Satyajit",
        "lastName": "Ghosh",
        "age": "20",
        "address": "Katwa",
        "phoneNumber": "9475757575",
        "qualification": "BCA",
        "achievements": "Highest CGPA Holder",
        "experience": "Technical Content Writer",
        "skills": "BlockChain",
        "certificates": "Google IT Support Certified",
        "Timestamp": {
            "seconds": {
                "low": 1663177479,
                "high": 0,
                "unsigned": false
            },
            "nanos": 383000000
        }
    },
    {
        "firstName": "Satyajit",
        "lastName": "Ghosh",
        "age": "20",
        "address": "Katwa",
        "phoneNumber": "9475757575",
        "qualification": [],
        "achievements": [],
        "experience": [],
        "skills": [],
        "certificates": [],
        "Timestamp": {
            "seconds": {
                "low": 1663177471,
                "high": 0,
                "unsigned": false
            },
            "nanos": 772000000
        }
    }
]
```