var config = require('./config')

WALLET_ADDRESS = config.makerAddress
WALLET_PRIVATE_KEY = config.privatekey

// const ethers = require('ethers')
const Web3 = require('web3')
const axios = require('axios')
const { SendQueue } = require('./send_queue')
const EthereumTx = require('ethereumjs-tx').Transaction
const Common = require('ethereumjs-common').default

let nonceDic = {}

// SendQueue

const sendQueue = new SendQueue()

// gasprice
const getCurrentGasPrices = async (chain) => {
  try {
    let response = await axios.post(config[chain].httpEndPoint, {
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 0,
    })
    if (response.status === 200 && response.statusText === 'OK') {
      console.log('gasPrice =', response.data.result)
      return response.data.result
    }
    return web3.utils.toHex(
      web3.utils.toWei(config[chain].gasPrice.toString(), 'gwei'),
    )
  } catch (error) {
    return web3.utils.toHex(
      web3.utils.toWei(config[chain].gasPrice.toString(), 'gwei'),
    )
  }
}

async function becomeCommit(chain) {
  const web3Net = config[chain].httpEndPoint
  const web3 = new Web3(web3Net)
  web3.eth.defaultAccount = WALLET_ADDRESS

  const destContract = new web3.eth.Contract(
    config.destABI,
    config.destDic[chain],
    (error, result) => {
      if (error) console.log(error)
    },
  )
  console.log(
    'address =',
    WALLET_ADDRESS,
    'contractAddress =',
    config.destDic[chain],
  )

  const result = await destContract.methods
    .commiterDeposit(WALLET_ADDRESS)
    .call({ from: WALLET_ADDRESS })
  console.log(result)
  if (!result) {
    let nonce = await web3.eth.getTransactionCount(
      web3.eth.defaultAccount,
      'pending',
    )
    let sql_nonce = nonceDic[chain]
    let result_nonce = 0
    if (!sql_nonce) {
      result_nonce = nonce
    } else {
      if (nonce > sql_nonce) {
        result_nonce = nonce
      } else {
        result_nonce = sql_nonce + 1
      }
    }
    nonceDic[chain] = result_nonce
    console.log('nonce =', nonce)
    console.log('sql_nonce =', sql_nonce)
    console.log('result_nonde =', result_nonce)

    /**
     * Fetch the current transaction gas prices from https://ethgasstation.info/
     */
    let gasPrices = await getCurrentGasPrices(chain)

    let gasLimit = 1000000

    /**
     * Build a new transaction object and sign it locally.
     */
    let destDetails = {}

    destDetails = {
      to: config.destDic[chain],
      value: '0x0',
      data: destContract.methods.becomeCommiter().encodeABI(),
      gas: web3.utils.toHex(gasLimit),
      gasPrice: gasPrices, // converts the gwei price to wei
      nonce: result_nonce,
      chainId: config[chain].chainID,
    }
    let result_chain = config[chain].chainID
    let useCommon = false
    let transaction
    if (chain === 22 || chain == 77) {
      useCommon = true
    }
    if (useCommon) {
      const customCommon = Common.forCustomChain(
        'mainnet',
        {
          name: 'toChain',
          networkId: result_chain,
          chainId: result_chain,
        },
        'petersburg',
      )
      transaction = new EthereumTx(destDetails, { common: customCommon })
    } else {
      transaction = new EthereumTx(destDetails, { chain: result_chain })
    }
    /**
     * This is where the transaction is authorized on your behalf.
     * The private key is what unlocks your wallet.
     */
    transaction.sign(Buffer.from(WALLET_PRIVATE_KEY, 'hex'))

    /**
     * Now, we'll compress the transaction info down into a transportable object.
     */
    const serializedTransaction = transaction.serialize()

    /**
     * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
     */
    // const addr = transaction.from.toString('hex')
    // log(`Based on your private key, your wallet address is ${addr}`)
    /**
     * We're ready! Submit the raw transaction details to the provider configured above.
     */

    return new Promise((resolve, reject) => {
      web3.eth
        .sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
        .on('transactionHash', (hash) => {
          resolve(hash)
          console.log('commit_transactionHash =', hash)
          // destContract
        })
        .on('error', (err) => {
          reject(err)
          console.log('commitError =', err)
        })
    })
  }
}

async function doDestContract(value, web3) {
  let { chain, dest, amountToSend, fee, tx, txindex, workindex, isFork } = value

  const destContract = new web3.eth.Contract(
    config.destABI,
    config.destDic[chain],
    (error, result) => {
      if (error) console.log(error)
    },
  )

  let nonce = await web3.eth.getTransactionCount(
    web3.eth.defaultAccount,
    'pending',
  )
  let sql_nonce = nonceDic[chain]
  let result_nonce = 0
  if (!sql_nonce) {
    result_nonce = nonce
  } else {
    if (nonce > sql_nonce) {
      result_nonce = nonce
    } else {
      result_nonce = sql_nonce + 1
    }
  }
  nonceDic[chain] = result_nonce
  console.log('nonce =', nonce)
  console.log('sql_nonce =', sql_nonce)
  console.log('result_nonde =', result_nonce)

  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  let gasPrices = await getCurrentGasPrices(chain)

  let gasLimit = 1000000

  /**
   * Build a new transaction object and sign it locally.
   */
  let destDetails = {}
  console.log('tx =', tx)
  console.log('txindex =', txindex)
  console.log('dest =', dest)
  console.log('amountToSend =', amountToSend)
  console.log('fee =', fee)
  console.log('workindex =', workindex)
  console.log('isFork =', isFork)
  console.log('chain =', chain)

  if (isFork) {
    destDetails = {
      to: config.destDic[chain],
      value: '0x0',
      data: destContract.methods
        .zFork(chain, tx, txindex, dest, amountToSend, fee, true)
        .encodeABI(),
      gas: web3.utils.toHex(gasLimit),
      gasPrice: gasPrices, // converts the gwei price to wei
      nonce: result_nonce,
      chainId: config[chain].chainID,
    }
  } else {
    destDetails = {
      to: config.destDic[chain],
      value: '0x0',
      data: destContract.methods
        .claim(
          chain,
          tx,
          txindex,
          workindex,
          [{ destination: dest, amount: amountToSend, fee: fee }],
          [true],
        )
        .encodeABI(),
      gas: web3.utils.toHex(gasLimit),
      gasPrice: gasPrices, // converts the gwei price to wei
      nonce: result_nonce,
      chainId: config[chain].chainID,
    }
  }
  console.log('destDetails =', destDetails)
  let result_chain = config[chain].chainID
  let useCommon = false
  let transaction
  if (chain === 22 || chain == 77) {
    useCommon = true
  }
  if (useCommon) {
    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'toChain',
        networkId: result_chain,
        chainId: result_chain,
      },
      'petersburg',
    )
    transaction = new EthereumTx(destDetails, { common: customCommon })
  } else {
    transaction = new EthereumTx(destDetails, { chain: result_chain })
  }
  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */
  transaction.sign(Buffer.from(WALLET_PRIVATE_KEY, 'hex'))

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize()

  /**
   * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
   */
  // const addr = transaction.from.toString('hex')
  // log(`Based on your private key, your wallet address is ${addr}`)
  /**
   * We're ready! Submit the raw transaction details to the provider configured above.
   */
  web3.eth
    .sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
    .on('transactionHash', async (hash) => {
      console.log('dest_transactionHash =', hash)
      console.log('****************************************')
    })
    .on('error', (err) => {
      console.log('destError =', err)
    })
}

async function approveToken(value, web3) {
  let { chain, dest, amountToSend, fee, tx, txindex, workindex, isFork } = value

  const tokenContract = new web3.eth.Contract(
    config.tokenABI,
    config.tokenDic[chain],
    (error, result) => {
      if (error) console.log(error)
    },
  )

  let tokenBalanceWei = 0

  await tokenContract.methods.balanceOf(web3.eth.defaultAccount).call(
    {
      from: web3.eth.defaultAccount,
    },
    function (error, result) {
      if (!error) {
        tokenBalanceWei = result
      } else {
        console.log('tokenBalanceWeiError =', error)
      }
    },
  )
  if (!tokenBalanceWei) {
    console.log('Insufficient balance')
    return {
      code: 1,
      txid: 'Insufficient balance',
    }
  }
  console.log('tokenBalance =', tokenBalanceWei)
  if (BigInt(tokenBalanceWei) < BigInt(amountToSend)) {
    console.log('Insufficient balance')
    return {
      code: 1,
      txid: 'Insufficient balance',
    }
  }
  /**
   * With every new transaction you send using a specific wallet address,
   * you need to increase a nonce which is tied to the sender wallet.
   */
  let nonce = await web3.eth.getTransactionCount(
    web3.eth.defaultAccount,
    'pending',
  )
  let sql_nonce = nonceDic[chain]
  let result_nonce = 0
  if (!sql_nonce) {
    result_nonce = nonce
  } else {
    if (nonce > sql_nonce) {
      result_nonce = nonce
    } else {
      result_nonce = sql_nonce + 1
    }
  }
  nonceDic[chain] = result_nonce
  console.log('nonce =', nonce)
  console.log('sql_nonce =', sql_nonce)
  console.log('result_nonde =', result_nonce)

  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  let gasPrices = await getCurrentGasPrices(chain)

  let gasLimit = 1000000

  /**
   * Build a new transaction object and sign it locally.
   */
  let aprovelDetails = {
    to: config.tokenDic[chain],
    value: '0x0',
    data: tokenContract.methods
      .approve(config.destDic[chain], web3.utils.toHex(amountToSend))
      .encodeABI(),
    gas: web3.utils.toHex(gasLimit),
    gasPrice: gasPrices, // converts the gwei price to wei
    nonce: result_nonce,
    chainId: config[chain].chainID, // mainnet: 1, rinkeby: 4
  }

  let result_chain = config[chain].chainID
  let useCommon = false
  let transaction
  if (chain === 22 || chain == 77) {
    useCommon = true
  }
  if (useCommon) {
    const customCommon = Common.forCustomChain(
      'mainnet',
      {
        name: 'toChain',
        networkId: result_chain,
        chainId: result_chain,
      },
      'petersburg',
    )
    transaction = new EthereumTx(aprovelDetails, { common: customCommon })
  } else {
    transaction = new EthereumTx(aprovelDetails, { chain: result_chain })
  }
  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */
  transaction.sign(Buffer.from(WALLET_PRIVATE_KEY, 'hex'))

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize()

  /**
   * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
   */
  // const addr = transaction.from.toString('hex')
  // log(`Based on your private key, your wallet address is ${addr}`)
  /**
   * We're ready! Submit the raw transaction details to the provider configured above.
   */
  web3.eth
    .sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
    .on('transactionHash', async (hash) => {
      console.log('approve_transactionHash =', hash)
      // destContract
      doDestContract(value, web3)
    })
    .on('error', (err) => {
      console.log('approveError =', err)
    })
}

async function sendConsumer(value) {
  let { chain } = value

  console.log('chain =', chain)
  const web3Net = config[chain].httpEndPoint
  const web3 = new Web3(web3Net)
  web3.eth.defaultAccount = WALLET_ADDRESS

  await approveToken(value, web3)
}

/**
 * This is the process that will run when you execute the program.
 */
async function send(
  chain,
  dest,
  amountToSend,
  fee,
  tx,
  txindex,
  workindex,
  isFork,
) {
  sendQueue.registerConsumer(chain, sendConsumer)

  return new Promise((resolve, reject) => {
    const value = {
      chain,
      dest,
      amountToSend,
      fee,
      tx,
      txindex,
      workindex,
      isFork,
    }
    sendQueue.produce(chain, {
      value,
      callback: (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    })
  })
}

module.exports = {
  send,
  becomeCommit,
}
