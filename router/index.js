const { getUserRevenue } = require('../userRevenue')
const express = require('express')
const ethers = require("ethers");
const cors = require('cors');
const app = express()
const server = async () => {
    app.use(cors());
    app.get('/getAccountRevenue/:account/:dTokenAddress', async (req, res) => {
        let data = await getUserRevenue(req.params.account, req.params.dTokenAddress)
        data === null ? data = ethers.BigNumber.from(0) : ethers.BigNumber.from(data)
        res.send(data)
    })
    app.listen(3000, () => {
        console.log('https server running')
    })
}

module.exports = {
    server
};
