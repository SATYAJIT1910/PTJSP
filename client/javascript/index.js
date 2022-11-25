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
////

async function initcont() {
    // This function initializes the contract.
    contract = await cont.initContract();
    console.log(contract)
}

initcont();
