var config = require("./config");

WALLET_ADDRESS = config.makerAddress;
WALLET_PRIVATE_KEY = config.privatekey;

// const ethers = require('ethers')
const Web3 = require("web3");
const axios = require("axios");
const { SendQueue } = require("./send_queue");
const { utils, ethers, constants } = require("ethers");
const EthereumTx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;

/**
 * Generate fork's key
 * @param chainId
 * @param hashOnion
 * @param index
 * @returns
 */
function generateForkKey(chainId, hashOnion, index = 0) {
  return utils.keccak256(
    utils.defaultAbiCoder.encode(
      ["uint256", "bytes32", "uint8"],
      [chainId, hashOnion, index]
    )
  );
}

let nonceDic = {};

// SendQueue

const sendQueue = new SendQueue();

// gasprice
const getCurrentGasPrices = async (chain) => {
  try {
    let response = await axios.post(config[chain].httpEndPoint, {
      jsonrpc: "2.0",
      method: "eth_gasPrice",
      params: [],
      id: 0,
    });
    if (response.status === 200 && response.statusText === "OK") {
      console.log("gasPrice =", response.data.result);
      return response.data.result;
    }
    return Web3.utils.toHex(
      Web3.utils.toWei(config[chain].gasPrice.toString(), "gwei")
    );
  } catch (error) {
    return Web3.utils.toHex(
      Web3.utils.toWei(config[chain].gasPrice.toString(), "gwei")
    );
  }
};

async function becomeCommit(chain) {
  const web3Net = config[chain].httpEndPoint;
  const web3 = new Web3(web3Net);
  web3.eth.defaultAccount = WALLET_ADDRESS;

  const destContract = new web3.eth.Contract(
    config.destABI,
    config.destDic[chain],
    (error, result) => {
      if (error) console.log(error);
    }
  );
  console.log(
    "address =",
    WALLET_ADDRESS,
    "contractAddress =",
    config.destDic[chain]
  );

  // const result = await destContract.methods
  //   .commiterDeposit(WALLET_ADDRESS)
  //   .call({ from: WALLET_ADDRESS });
  // console.log(result);
  const result = false;
  if (!result) {
    let nonce = await web3.eth.getTransactionCount(
      web3.eth.defaultAccount,
      "pending"
    );
    let sql_nonce = nonceDic[chain];
    let result_nonce = 0;
    if (!sql_nonce) {
      result_nonce = nonce;
    } else {
      if (nonce > sql_nonce) {
        result_nonce = nonce;
      } else {
        result_nonce = sql_nonce + 1;
      }
    }
    nonceDic[chain] = result_nonce;
    console.log("nonce =", nonce);
    console.log("sql_nonce =", sql_nonce);
    console.log("result_nonde =", result_nonce);

    /**
     * Fetch the current transaction gas prices from https://ethgasstation.info/
     */
    let gasPrices = await getCurrentGasPrices(chain);

    let gasLimit = 1000000;

    /**
     * Build a new transaction object and sign it locally.
     */
    let destDetails = {};

    destDetails = {
      to: config.destDic[chain],
      value: "0x0",
      data: destContract.methods.becomeCommiter().encodeABI(),
      gas: web3.utils.toHex(gasLimit),
      gasPrice: gasPrices, // converts the gwei price to wei
      nonce: result_nonce,
      chainId: config[chain].chainID,
    };
    let result_chain = config[chain].chainID;
    let useCommon = false;
    let transaction;
    if (chain === 22 || chain == 77) {
      useCommon = true;
    }
    if (useCommon) {
      const customCommon = Common.forCustomChain(
        "mainnet",
        {
          name: "toChain",
          networkId: result_chain,
          chainId: result_chain,
        },
        "petersburg"
      );
      transaction = new EthereumTx(destDetails, { common: customCommon });
    } else {
      transaction = new EthereumTx(destDetails, { chain: result_chain });
    }
    /**
     * This is where the transaction is authorized on your behalf.
     * The private key is what unlocks your wallet.
     */
    transaction.sign(Buffer.from(WALLET_PRIVATE_KEY, "hex"));

    /**
     * Now, we'll compress the transaction info down into a transportable object.
     */
    const serializedTransaction = transaction.serialize();

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
        .sendSignedTransaction("0x" + serializedTransaction.toString("hex"))
        .on("transactionHash", (hash) => {
          resolve(hash);
          console.log("commit_transactionHash =", hash);
          // destContract
        })
        .on("error", (err) => {
          reject(err);
          console.log("commitError =", err);
        });
    });
  }
}

async function doDestContract(value, web3) {
  let { chain, fromChain, dest, amountToSend, fee, tx, txindex, workindex, isFork } =
    value;
  const tokenAddress = config.tokenDic[chain];
  const destABI = config.destABI
  const destAddress = config.destDic[chain]
  const destContract = new web3.eth.Contract(
    destABI,
    destAddress,
    (error, result) => {
      if (error) console.log(error);
    }
  );
  let destDetailsValue = tokenAddress === ethers.constants.AddressZero ? web3.utils.toHex(amountToSend) : '0x0';

  let nonce = await web3.eth.getTransactionCount(
    web3.eth.defaultAccount,
    "pending"
  );
  let sql_nonce = nonceDic[chain];
  let result_nonce = 0;
  if (!sql_nonce) {
    result_nonce = nonce;
  } else {
    if (nonce > sql_nonce) {
      result_nonce = nonce;
    } else {
      result_nonce = sql_nonce + 1;
    }
  }
  nonceDic[chain] = result_nonce;
  console.log("nonce =", nonce);
  console.log("sql_nonce =", sql_nonce);
  console.log("result_nonde =", result_nonce);

  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  let gasPrices = await getCurrentGasPrices(chain);

  let gasLimit = 1000000;

  /**
   * Build a new transaction object and sign it locally.
   */
  let destDetails = {};
  console.log("tx =", tx);
  console.log("txindex =", txindex);
  console.log("dest =", dest);
  console.log("amountToSend =", amountToSend);
  console.log("fee =", fee);
  console.log("workindex =", workindex);
  console.log("isFork =", isFork);
  console.log("chain =", chain);
  console.log("fromChain=", fromChain);

  const workForkKey = generateForkKey(fromChain, tx, 0);
  console.warn('workForkKey:: ', workForkKey);
  if (isFork) {
    console.warn(
      "chain, fromChain, tx, txindex, dest, amountToSend, fee >>>> ",
      chain,
      fromChain,
      tx,
      txindex,
      dest,
      amountToSend,
      fee
    );
    destDetails = {
      to: destAddress,
      value: destDetailsValue,
      data: destContract.methods
        .zFork(fromChain, workForkKey, dest, amountToSend, fee, true)
        .encodeABI(),
      gas: web3.utils.toHex(gasLimit),
      gasPrice: gasPrices, // converts the gwei price to wei
      nonce: result_nonce,
      chainId: config[chain].chainID,
    };
  } else {
    console.warn("Chain, fromChain, tx, 0 >>>> ", chain, fromChain, tx, 0);
    destDetails = {
      to: destAddress,
      value: destDetailsValue,
      data: destContract.methods
        .claim(
          fromChain,
          workForkKey,
          workindex,
          [{ destination: dest, amount: amountToSend, fee: fee }],
          [true]
        )
        .encodeABI(),
      gas: web3.utils.toHex(gasLimit),
      gasPrice: gasPrices, // converts the gwei price to wei
      nonce: result_nonce,
      chainId: config[chain].chainID,
    };
  }
  console.log("destDetails =", destDetails);
  let result_chain = config[chain].chainID;
  let useCommon = false;
  let transaction;
  if (chain === 22 || chain == 77) {
    useCommon = true;
  }
  if (useCommon) {
    const customCommon = Common.forCustomChain(
      "mainnet",
      {
        name: "toChain",
        networkId: result_chain,
        chainId: result_chain,
      },
      "petersburg"
    );
    transaction = new EthereumTx(destDetails, { common: customCommon });
  } else {
    transaction = new EthereumTx(destDetails, { chain: result_chain });
  }
  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */
  transaction.sign(Buffer.from(WALLET_PRIVATE_KEY, "hex"));

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize();

  /**
   * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
   */
  // const addr = transaction.from.toString('hex')
  // log(`Based on your private key, your wallet address is ${addr}`)
  /**
   * We're ready! Submit the raw transaction details to the provider configured above.
   */
  web3.eth
    .sendSignedTransaction("0x" + serializedTransaction.toString("hex"))
    .on("transactionHash", async (hash) => {
      console.log("dest_transactionHash =", hash);
      console.log("****************************************");
    })
    .on("error", (err) => {
      console.log("destError =", err);
    });
}

async function approveToken(value, web3) {
  let { chain, fromChain, dest, amountToSend, fee, tx, txindex, workindex, isFork } =
    value;

  const tokenAddress = config.tokenDic[chain];
  const destAddress = config.destDic[chain]
  const tokenABI = config.tokenABI
  const provider = new ethers.providers.JsonRpcProvider(

    config[chain].httpEndPoint
  );
  const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider)
  const singer = wallet.provider.getSigner(wallet.address);
  let tokenBalanceWei = 0;
  let aprovelDetailsData = constants.HashZero;

  if (tokenAddress == ethers.constants.AddressZero) {
    // ETH
    tokenBalanceWei = await provider.getBalance(web3.eth.defaultAccount)
  } else {
    // ERC20
    const tokenContract = new ethers.Contract(
      tokenAddress,
      tokenABI,
      singer
    )
    tokenBalanceWei = await tokenContract.balanceOf(web3.eth.defaultAccount)
    let ABI = ["function approve(address spender, uint256 amount)"]
    let iface = new ethers.utils.Interface(ABI)
    aprovelDetailsData = iface.encodeFunctionData("approve", [destAddress, web3.utils.toHex(amountToSend)])
  }

  if (!tokenBalanceWei) {
    console.log("Insufficient balance");
    return {
      code: 1,
      txid: "Insufficient balance",
    };
  }
  console.log("tokenBalance =", tokenBalanceWei);
  if (BigInt(tokenBalanceWei) < BigInt(amountToSend)) {
    console.log("Insufficient balance");
    return {
      code: 1,
      txid: "Insufficient balance",
    };
  }
  /**
   * With every new transaction you send using a specific wallet address,
   * you need to increase a nonce which is tied to the sender wallet.
   */
  let nonce = await web3.eth.getTransactionCount(
    web3.eth.defaultAccount,
    "pending"
  );
  let sql_nonce = nonceDic[chain];
  let result_nonce = 0;
  if (!sql_nonce) {
    result_nonce = nonce;
  } else {
    if (nonce > sql_nonce) {
      result_nonce = nonce;
    } else {
      result_nonce = sql_nonce + 1;
    }
  }
  nonceDic[chain] = result_nonce;
  console.log("nonce =", nonce);
  console.log("sql_nonce =", sql_nonce);
  console.log("result_nonde =", result_nonce);

  /**
   * Fetch the current transaction gas prices from https://ethgasstation.info/
   */
  let gasPrices = await getCurrentGasPrices(chain);

  let gasLimit = 1000000;

  /**
   * Build a new transaction object and sign it locally.
   */
  let aprovelDetails = {
    to: tokenAddress,
    value: "0x0",
    data: aprovelDetailsData,
    gas: web3.utils.toHex(gasLimit),
    gasPrice: gasPrices, // converts the gwei price to wei
    nonce: result_nonce,
    chainId: config[chain].chainID, // mainnet: 1, goerli: 5, arb goerli: 22
  };

  let result_chain = config[chain].chainID;
  let useCommon = false;
  let transaction;
  if (chain === 22 || chain == 77) {
    useCommon = true;
  }
  if (useCommon) {
    const customCommon = Common.forCustomChain(
      "mainnet",
      {
        name: "toChain",
        networkId: result_chain,
        chainId: result_chain,
      },
      "petersburg"
    );
    transaction = new EthereumTx(aprovelDetails, { common: customCommon });
  } else {
    transaction = new EthereumTx(aprovelDetails, { chain: result_chain });
  }
  /**
   * This is where the transaction is authorized on your behalf.
   * The private key is what unlocks your wallet.
   */
  transaction.sign(Buffer.from(WALLET_PRIVATE_KEY, "hex"));

  /**
   * Now, we'll compress the transaction info down into a transportable object.
   */
  const serializedTransaction = transaction.serialize();

  /**
   * Note that the Web3 library is able to automatically determine the "from" address based on your private key.
   */
  // const addr = transaction.from.toString('hex')
  // log(`Based on your private key, your wallet address is ${addr}`)
  /**
   * We're ready! Submit the raw transaction details to the provider configured above.
   */
  web3.eth
    .sendSignedTransaction("0x" + serializedTransaction.toString("hex"))
    .on("transactionHash", async (hash) => {
      console.log("approve_transactionHash =", hash);
      // destContract
      doDestContract(value, web3);
    })
    .on("error", (err) => {
      console.log("approveError =", err);
    });
}

async function sendConsumer(value) {
  let { chain } = value;

  console.log("chain =", chain);
  const web3Net = config[chain].httpEndPoint;
  const web3 = new Web3(web3Net);
  web3.eth.defaultAccount = WALLET_ADDRESS;

  await approveToken(value, web3);
}

/**
 * This is the process that will run when you execute the program.
 */
async function send(
  chain,
  fromChain,
  dest,
  amountToSend,
  fee,
  tx,
  txindex,
  workindex,
  isFork
) {
  sendQueue.registerConsumer(chain, sendConsumer);

  return new Promise((resolve, reject) => {
    const value = {
      chain,
      fromChain,
      dest,
      amountToSend,
      fee,
      tx,
      txindex,
      workindex,
      isFork,
    };
    sendQueue.produce(chain, {
      value,
      callback: (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    });
  });
}

module.exports = {
  send,
  becomeCommit,
};
