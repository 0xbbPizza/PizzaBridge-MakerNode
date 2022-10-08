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
        } else {
            const accountList = await redisDB.smembers(KEY)
            for (let i = 0, len = accountList.length; i < len; i++) {
                const userAddress = accountList[i]
                const preParams = await getUserRevenue(userAddress, dTokenAddress)
                const preRevenue = preParams === null ? ethers.BigNumber.from(0) : ethers.BigNumber.from(preParams)
                const exchangeRate = await dTokenContract.exchangeRateStored()
                const currentAccountDTokenCash = await dTokenContract.balanceOf(userAddress)
                const currentDTokenCash = (await dTokenContract.getCashPrior()).add(accountOrAmount)
                const currentRevenue = (
                    (exchangeRate.mul(currentAccountDTokenCash).div(
                        ethers.utils.parseEther('1')
                    ).sub(currentAccountDTokenCash)).mul(currentAccountDTokenCash.div(currentDTokenCash))
                )
                const totalRevenue = preRevenue.add(currentRevenue)
                await redisDB.hset(userAddress, dTokenAddress, String(totalRevenue))
                console.log('totalRevenue update success ==> ', userAddress)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function getUserRevenue(userAddress, dTokenAddress) {
    return await redisDB.hget(userAddress.toLowerCase(), dTokenAddress)
}

module.exports = {
    addUserOrRevenue,
    getUserRevenue
};
