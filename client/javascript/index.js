/**
 * @author Satyajit Ghosh
 * @date 2022-11-25
 */
'use strict';

let contract;
const cont = require('./contract_invoke')
const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const express = require("express");
const app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Static Middleware
app.use(express.static('public'));
////

async function initcont() {
    // This function initializes the contract.
    contract = await cont.initContract();
    console.log(contract)
}

// This function starts the express server
app.listen(3000, async () => {
    console.log("Started on PORT 3000");
    console.log("Server Started Successfully");
    initcont();
})
// root
app.get('/',(req,res)=>{
    res.redirect("home.html")
})
app.get('/admin/login',(req,res)=>{
    res.redirect("login.html")
})
app.post('/admin/login/verfify',(req,res)=>{
    console.log(req.body)
    if(req.body.username=='admin' && req.body.password=='1234'){
        res.redirect('/admin/dashboard')
    }else{
        res.send("Invaild Credientials")
    }
})
app.get('/admin/dashboard',(req,res)=>{
    res.redirect('dashboard.html')
})
app.get('/admin/allusers', async (req, res) => {
    try {
        res.render('admin/admin_all_user',{"data":JSON.parse(await readAllJobSeeker())})
        ;
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(404);
    }
})
app.get('/admin/alljobs', async (req, res) => {
    try {
        res.json(JSON.parse(await queryAllJobposting()));
    } catch (error) {
        res.sendStatus(404);
    }
})




// Blockchain executer methods
async function readAllJobSeeker() {
    const result = await contract.evaluateTransaction('AdminContract:queryAllJobSeeker');
    console.log(`AdminContract:queryAllJobSeeker-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;

}
async function queryAllJobposting() {
    const result = await contract.evaluateTransaction('AdminContract:queryAllJobPosting');
    console.log(`AdminContract:queryAllJobPosting-Transaction has been evaluated, result is: ${result.toString()}`);
    return result;
}