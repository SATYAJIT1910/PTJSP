/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
 * @author Satyajit Ghosh
 * @email satyajit.ghosh@stu.adamasuniversity.ac.in
 * @date 2022-09-25
 */


'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');



const hRId = ['HR1']
const Profilename = ['Software Engineer','Hardware Engineer','Analyst','Cloud Engineer']
const Qualification = ['BCA','MCA','BTECH','MTECH']
const Agelimit = ['25','30','35','22']
const Salary = ['50000','20000','30000','70000']
const Location = ['Kolkata','Delhi','Mumbai','UK']
const Yearofexperience = ['0','2','1','3']
const Skills = ['Java','Python','BlockChain','SQL']
const Companyname = ['Amazon','FlipKart','FaceBook','Microsoft']

/**
 * Workload module for the benchmark round.
 */
class CreateCarWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        this.txIndex++;
        let jobpostingId = 'JP'+'_'+this.workerIndex+'_'+this.txIndex.toString()+'a';
        let HRId = hRId[Math.floor(Math.random() * hRId.length)];
        let profilename = Profilename[Math.floor(Math.random() * Profilename.length)];
        let qualification = Qualification[Math.floor(Math.random() * Qualification.length)];
        let agelimit = Agelimit[Math.floor(Math.random() * Agelimit.length)];
        let salary = Salary[Math.floor(Math.random() * Salary.length)];
        let location = Location[Math.floor(Math.random() * Location.length)];
        let yearofexperience = Yearofexperience[Math.floor(Math.random() * Yearofexperience.length)];
        let skills = Skills[Math.floor(Math.random() * Skills.length)];
        let companyname = Companyname[Math.floor(Math.random() * Companyname.length)];

        let input={
            "jobpostingId":jobpostingId,
            "HRId":HRId,
            "profilename":profilename,
            "qualification":qualification,
            "agelimit":agelimit,
            "location":location,
            "yearofexperience":yearofexperience,
            "salary":salary,
            "skills":skills,
            "companyname":companyname
        }

        let args = {
            contractId: 'ptjsp',
            contractVersion: 'v1',
            contractFunction: 'HRContract:createjobposting',
            contractArguments: [JSON.stringify(input)],
            timeout: 30
        };

        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateCarWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
