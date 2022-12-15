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

const JobseekerId = ['JS1','JS2','JS3','JS4','JS5']
const FirstName = ['Satyajit','Rakibul','Aditya','Aratrika','Sayantan']
const LastName = ['Ghosh','Islam','Jaman','Bose','Jana']
const Password = ['123','122','213','421','422']
const Age = ['19','20','21','22','23']
const PhoneNumber = ['99999999','88888888','77777777','66666666','5555555']
const Address = ['Kolkata','Delhi','Mumbai','USA','UK']

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
        let jobseekerId = 'JS'+'_'+this.workerIndex+'_'+this.txIndex.toString();
        let firstName = FirstName[Math.floor(Math.random() * FirstName.length)];
        let lastName = LastName[Math.floor(Math.random() * LastName.length)];
        let password = Password[Math.floor(Math.random() * Password.length)];
        let age = Age[Math.floor(Math.random() * Age.length)];
        let phoneNumber = PhoneNumber[Math.floor(Math.random() * PhoneNumber.length)];
        let address = Address[Math.floor(Math.random() * Address.length)];

        let input={
            "jobseekerId":jobseekerId,
            "firstName":firstName,
            "lastName":lastName,
            "password":password,
            "age":age,
            "phoneNumber":phoneNumber,
            "address":address
        }

        let args = {
            contractId: 'ptjsp',
            contractVersion: 'v1',
            contractFunction: 'JobseekerContract:createjobseeker',
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
