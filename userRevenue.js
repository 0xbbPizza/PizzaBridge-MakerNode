const { redisDB } = require('./db/redis')
const ethers = require("ethers");
const KEY = 'UserAddressList'

async function addUserOrRevenue(accountOrAmount, dTokenAddress, dTokenContract, chain) {
    console.log('accountOrAmount', accountOrAmount);
    console.log('dTokenAddress', dTokenAddress);
    console.log('chain: ', chain);
    try {
        if (ethers.utils.isAddress(accountOrAmount)) {
            await redisDB.sadd(KEY, accountOrAmount.toLowerCase())
        } else if (ethers.BigNumber.isBigNumber(accountOrAmount)) {
            const accountList = await redisDB.smembers(KEY)
            const decimals = await dTokenContract.decimals()
            for (let i = 0, len = accountList.length; i < len; i++) {
                const userAddress = accountList[i]
                const preParams = await getUserRevenue(userAddress, dTokenAddress)
                const preRevenue = preParams === null ? ethers.BigNumber.from(0) : ethers.BigNumber.from(preParams)
                const exchangeRate = await dTokenContract.exchangeRateStored()
                const currentAccountDTokenCash = await dTokenContract.balanceOf(userAddress)
                const currentDTokenCash = (await dTokenContract.getCashPrior()).add(accountOrAmount)
                const currentRevenue = (
                    (exchangeRate.mul(currentAccountDTokenCash).div(
                        ethers.utils.parseUnits('1', decimals)
                    ).sub(currentAccountDTokenCash)).mul(currentAccountDTokenCash.div(currentDTokenCash))
                )
                const totalRevenue = preRevenue.add(currentRevenue)
                await redisDB.hset(userAddress, dTokenAddress, String(totalRevenue))
                console.log('totalRevenue update success ==> ', userAddress)
            }
            await redisDB.rpush('Timestamp' + chain, new Date().getTime())
        }
    } catch (error) {
        console.log(error)
    }
}

async function getUserRevenue(userAddress, dTokenAddress) {
    return await redisDB.hget(userAddress.toLowerCase(), dTokenAddress)
}

async function getRevenueFlag(chain, min) {
    const ms = 60000
    const timeStep = ms * min //  5min
    let nowTime = new Date().getTime()
    let lastTime = await redisDB.lindex('Timestamp' + chain, -1)
    lastTime === null ? lastTime = nowTime - ms * (min / 2) : lastTime
    return nowTime - lastTime <= timeStep
}
module.exports = {
    addUserOrRevenue,
    getUserRevenue,
    getRevenueFlag
};
