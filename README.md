### Citation :

```
@INPROCEEDINGS{10074582,
  author={Ghosh, Satyajit and Islam, Rakibul and Jaman, Aditya and Bose, Aratrika and Roy, Abhishek},
  booktitle={2023 International Conference on Advances in Intelligent Computing and Applications (AICAPS)}, 
  title={ChainHire: A Privacy-Preserving and Transparent Job Search Portal Using an Enterprise-Level Permissioned Blockchain Framework}, 
  year={2023},
  volume={},
  number={},
  pages={1-6},
  doi={10.1109/AICAPS57044.2023.10074582}}
```

### Requirements :
1. Node v10.19.0
2. NPM v6.14.4
3. Docker version 20.10.12, build 20.10.12-0ubuntu2~20.04.1
4. Git 2.25.1
5. cURL 7.68.0

( https://hyperledger-fabric.readthedocs.io/ml/latest/prereqs.html )

<b>Install Command</b>
```
sudo apt-get update
sudo apt-get install git curl docker docker-compose
```
<hr>

### Add Permission for docker to run as as non-root user

```
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

### Install Node JS and NPM using NVM

Install nvm
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```
then install the node 10.19

```
nvm install 10.19
```
after that use that version using -

```
nvm use 10.19
```

then create symbolic links to run nvm node with root

```
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/node" "/usr/local/bin/node"
sudo ln -s "$NVM_DIR/versions/node/$(nvm version)/bin/npm" "/usr/local/bin/npm"
```


If you don't use this node version, then your <code>npm install</code> will be stucked.




### Install Samples, Binaries, and Docker Images

```
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.2 1.4.9
```
(https://hyperledger-fabric.readthedocs.io/ml/latest/install.html)

### Clone this repository
```
git clone git@github.com:SATYAJIT1910/PTJSP.git
```

### Next run the script (go to test-network folder and then)
```
./start.sh
```
### Run the Server (go to client/javascript/ folder and then)

Run this for one time to install requirements
```
npm install
```
Next run the following commands to register admin and user in blockchain

```
node enrollAdmin.js
node registerUser.js
```
Make a .env file inside <code>client/javascript/</code> . It should look like below sample -
```
# .env file
ADMIN_ID="your_admin_id"
ADMIN_KEY="your_admin_password"

HR1_ID='your_hr1_id'
HR2_ID='your_hr2_id'
HR3_ID='your_hr3_id'
HR4_ID='your_hr4_id'

HR1_KEY="your_hr1_password"
HR2_KEY="your_hr2_password"
HR3_KEY="your_hr3_password"
HR4_KEY="your_hr4_password"
```

To start the server use -
```
npm start
```
## Important Points

To clear the network use -
```
sudo ./network.sh down
```
from test-network folder.
<hr>
Then to make sure all the docker containers are clear additionally you can use -

```
docker rm $(docker ps -a -q) -f
```
<hr>
To start the network again after system shutdown , you need to re-run the docker containers

```
docker start $(docker ps -a -q)
```
<hr>
If you clean the network , then again you need to delete the <code>admin.id</code> and <code>appUser.id</code> from the <code>/client/javascript/wallet/</code> and again generate them using <code>enrollAdmin.js</code>
and <code>registerUser.js</code>

<hr>

# Production Only

## To generate SSL certificate for Server


```
sudo apt-get install certbot
sudo certbot certonly --standalone
```

<br><b>Note: </b>Change the domain name in the <code>invokeprod.js</code> as per your setup</b>

Run as 

```
sudo npm run prod
```
<hr>

## Team Members
<hr>
<table>
    <tr>
        <td align="center">
            <a href="https://www.linkedin.com/in/satyajit1910/">
                <img src="https://i.postimg.cc/pd2f31Pd/satya.jpg" width="120px;" alt=""/><p><b>Satyajit Ghosh <br>(Team Lead, Blockchain & Back-end)</b></p><br />
                <!-- <sub><b>brookmg</b></sub> -->
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/Rakib0153">
                <img src="https://i.postimg.cc/SxW0gjKh/rakibul.jpg" width="120px;" alt=""/>
                <p><b>Rakibul Islam<br>(Front-end)</b></p><br />
            </a>
        </td>
        <td align="center">
            <a href="https://www.linkedin.com/in/aditya-jaman-85892524b/">
                <img src="https://i.postimg.cc/SNLRMQpn/aditya.jpg" width="120px;" alt=""/>
                <p><b>Aditya Jaman<br>(Assistant to Rakibul)</b></p><br />
            </a>
        </td>
            <td align="center">
        <a href="https://www.linkedin.com/in/aratrika-bose-0503231b3/">
            <img src="https://i.postimg.cc/5yxGKm6d/aratrika.jpg" width="120px;" alt=""/>
            <p><b>Aratrika Bose<br>(Presenter)</b></p><br />
        </a>
    </td>
        <td align="center">
    <a href="https://vidwan.inflibnet.ac.in/profile/163702">
        <img src="https://i.postimg.cc/xCN3PN0G/abhishekroy.jpg" width="120px;" alt=""/>
        <p><b>Dr. Abhishek Roy <br>(Supervisor)</b></p>
        <br />
    </a>
</td>
 </table>
 
 ## Acknowledgements
 
 <table>
<tr>
<td align="center">
    <a href="https://www.linkedin.com/in/aghosh0605/">
        <img src="https://i.postimg.cc/yxtm31qQ/ani.jpg" width="120px;" alt=""/>
        <p><b>Aniruddha Ghosh<br /></p>
    </a>
</td>
<td>
I wanted to express our gratitude to Aniruddha Ghosh from the Department of CSE at SRM University for taking the time to review our code and provide valuable suggestions for best practices. His expertise and guidance have been instrumental in improving the quality and efficiency of our work.
<br><br>
Thank you, Aniruddha, for your invaluable contribution to our project.
</td>
</tr>
</table>




<hr>
This documentation is written by <i>Satyajit Ghosh</i> (contact@satyajit.co.in & satyajit.ghosh@stu.adamasuniversity.ac.in)
<hr>

This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
