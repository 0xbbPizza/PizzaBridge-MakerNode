const { redisDB } = require('./db/redis')
const ethers = require("ethers");
const KEY = 'UserAddressList'

async function addUserOrRevenue(fromAddress, toAddress, dTokenAddress, destAddress, amount, dTokenContract) {
    console.log('fromAddress', fromAddress);
    console.log('toAddress', toAddress);
    console.log('dTokenAddress', dTokenAddress);
    console.log('destAddress', destAddress);
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
                console.log('totalRevenue update success ==> ', userAddress);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function getUserRevenue(userAddress, dTokenAddress) {
    return await redisDB.hget(userAddress.toLowerCase(), dTokenAddress)
}

module.exports = {
    addUserOrRevenue,
    getUserRevenue
};
