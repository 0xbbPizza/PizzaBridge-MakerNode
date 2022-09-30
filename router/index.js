const { getUserRevenue } = require('../userRevenue')
const express = require('express')
const ethers = require("ethers");
const https = require('https');
const cors = require('cors');
const path = require('path')
const fs = require('fs');
const app = express()
const privateKey = fs.readFileSync(path.join(__dirname, '/cert/private.key'), 'utf8')
const certificate = fs.readFileSync(path.join(__dirname, '/cert/__orbiter_finance.crt'), 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);
const server = async () => {
    app.use(cors());
    app.get('/getAccountRevenue/:account/:dTokenAddress', async (req, res) => {
        let data = await getUserRevenue(req.params.account, req.params.dTokenAddress)
        data === null ? data = ethers.BigNumber.from(0) : ethers.BigNumber.from(data)
        res.send(data)
    })
    httpsServer.listen(3000, () => {
        console.log('https server running')
    })
}

module.exports = {
    server
};
