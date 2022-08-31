const { redisDB } = require('./db/redis')
const ethers = require("ethers");
const KEY = 'UserAddressList'

async function addUserOrRevenue(fromAddress, toAddress, dTokenAddress, destAddress, amount, dTokenContract, chain) {
    console.log('fromAddress', fromAddress);
    console.log('toAddress', toAddress);
    console.log('dTokenAddress', dTokenAddress);
    console.log('destAddress', destAddress);
    console.log('chain: ', chain);
    try {
        if (fromAddress === ethers.constants.AddressZero && toAddress !== destAddress) {
            await redisDB.sadd(KEY, toAddress.toLowerCase())
        } else if (fromAddress === dTokenAddress && toAddress === destAddress) {
            const accountList = await redisDB.smembers(KEY)
            for (let i = 0, len = accountList.length; i < len; i++) {
                const userAddress = accountList[i]
                const preParams = await getUserRevenue(userAddress, dTokenAddress)
                const preRevenue = preParams === null ? ethers.BigNumber.from(0) : ethers.BigNumber.from(preParams)
                const exchangeRate = await dTokenContract.exchangeRateStored()
                const currentAccountDTokenCash = await dTokenContract.balanceOf(userAddress)
                const currentDTokenCash = (await dTokenContract.getCashPrior()).add(amount)
                const currentRevenue = (
                    (exchangeRate.mul(currentAccountDTokenCash).div(
                        ethers.utils.parseEther('1')
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
