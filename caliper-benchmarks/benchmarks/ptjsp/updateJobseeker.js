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

const Qualification = ['BCA','MCA','BTECH','MTECH']
const Achievements = ['NONE','BATCH TOPPER','STATE PLAYER','HIGHEST SCORER']
const Experience = ['NONE','2 YEARS','3 YEARS','4 YEARS']
const Skills = ['CODING','DRAWING','SINGING']
const Certificates = ['NONE','PROGRAMMING IN PYTHON','BLOCKCHAIN DEVELOPMENT']
const FirstName = ['Rajesh','Ratan','Somuya','Saminur']
const LastName = ['Ghosh','Pal','Dutta','Nandi']
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
        let jobseekerId = 'JS'+'_'+this.workerIndex+'_'+this.txIndex.toString()+'a';
        let firstName = FirstName[Math.floor(Math.random() * FirstName.length)];
        let lastName = LastName[Math.floor(Math.random() * LastName.length)];
        let qualification = Qualification[Math.floor(Math.random() * Qualification.length)];
        let achievements = Achievements[Math.floor(Math.random() * Achievements.length)];
        let experience = Experience[Math.floor(Math.random() * Experience.length)];
        let skills = Skills[Math.floor(Math.random() * Skills.length)];
        let certificates = Certificates[Math.floor(Math.random() * Certificates.length)];

        let input={
            "jobseekerId":jobseekerId,
            "firstName":firstName,
            "lastName":lastName,
            "qualification":qualification,
            "achievements":achievements,
            "experience":experience,
            "skills":skills,
            "certificates":certificates
        }

        let args = {
            contractId: 'ptjsp',
            contractVersion: 'v1',
            contractFunction: 'JobseekerContract:updatejobseeker',
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
