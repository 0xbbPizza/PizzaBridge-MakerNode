const dotenv = require("dotenv");
dotenv.config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const config = require("./config");
let sd = require("silly-datetime");
const sendTransaction = require("./sendTransaction");
const ethers = require("ethers");
const { sleep } = require("zksync/build/utils");
const axios = require("axios");
const { server } = require('./router/index')
const { addUserOrRevenue, getRevenueFlag } = require('./userRevenue')
const { saveConfig, getConfig } = require('./configSave')
let web3List = [];
let hashArray = {};
let bondParams = {};
let bondParamsAndHashKey = 'bondParamsAndHashConifg'
const workLimit = 5;
testExpress();
function test() {
  let chain = 22;
  let toChain = 5;
  let wsEndPoint = config[chain].wsEndPoint;
  let contractAddress = config.sourceDic[chain];

  const web3 = createAlchemyWeb3(wsEndPoint);
  const sourceContract = new web3.eth.Contract(
    config.sourceABI,
    contractAddress,
    (error, result) => {
      if (error) console.log(error);
    }
  );

  const options = {
    filter: {
      txindex: 1,
      chainId: toChain
    },
    fromBlock: "0"
  };

  sourceContract.getPastEvents("newTransfer", options, async (err, events) => {
    if (err) {
      console.log(err);
      return;
    }
    if (events.length === 0) {
      console.log("no txindex info");
      return;
    }

    let value = events[0].returnValues;
    console.log("newValue =", value);
    let amountToSend = value.amount;
    let dest = value.dest;
    let fee = value.fee;
    let tx =
      "0x1f5ee9240a225d8421e8f5484f69bcc317fd388457a241b71f0d50ed97869740";
    let txindex = 0;
    let isFork = false;
    let workindex = 1;
    await sendTransaction.send(
      toChain,
      dest,
      amountToSend,
      fee,
      tx,
      txindex,
      workindex,
      isFork
    );
  });
}

async function testExpress() {
  // test();
  try {
    server()
  } catch (err) {
    console.log('server', err);
  }
  let status = true
  while (status) {
    try {
      await sendTransaction.becomeCommit(5);
      await sendTransaction.becomeCommit(22);
      status = false
      console.log('status', status)
    } catch (error) {
      console.error("commiter_error =", error);
      // return;
    }
  }
  startMaker();
}

function stopMaker() {
  for (let index = 0; index < web3List.length; index++) {
    const web3 = web3List[index];
    web3.eth.clearSubscriptions();
  }
  web3List.splice(0, web3List.length);
  return "stop Maker";
}
async function startMaker() {
  if (web3List.length !== 0) {
    for (let index = 0; index < web3List.length; index++) {
      const web3 = web3List[index];
      web3.eth.clearSubscriptions();
    }
  }
  var sourceKeyList = Object.keys(config.sourceDic);
  let doInitBondParams = false
  try {
    let saveData = await getConfig(bondParamsAndHashKey)
    console.log('saveData', saveData);
    if (saveData === null) {
      doInitBondParams = true
    } else {
      bondParams = saveData.bondParams
      hashArray = saveData.hashArray
    }
  } catch (error) {
    console.log('getConfig error ==> ', error);

  }

  for (let index = 0; index < sourceKeyList.length; index++) {
    const chain = sourceKeyList[index];
    const contractAddress = config.sourceDic[chain];
    const dTokenAddress = config.dTokenDic[chain]
    const coinAddress = config.tokenDic[chain]
    const providers = config[chain];
    if (doInitBondParams) {
      let tmpHashArray = []
      hashArray[chain] = tmpHashArray
      let tmpBondParams = {
        prevForkKey: "",
        _transferDatas: [],
        _committers: [],
      }
      bondParams[chain] = tmpBondParams
    }
    watchPool(contractAddress, dTokenAddress, coinAddress, providers, chain, true);
  }
  return "start Maker";
}
function watchPool(sourceAddress, dTokenAddress, coinAddress, providers, chain, isSource) {
  // Instantiate web3 with WebSocketProvider
  let wsEndPoint = providers.wsEndPoint;
  let contractAddress = sourceAddress;

  const web3 = createAlchemyWeb3(wsEndPoint);

  web3List.push(web3);

  if (isSource) {
    const sourceContract = new web3.eth.Contract(
      config.sourceABI,
      contractAddress,
      (error, result) => {
        if (error) console.log(error);
      }
    );
    const dTokenContract = new web3.eth.Contract(
      config.dTokenABI,
      dTokenAddress,
      (error, result) => {
        if (error) console.log(error);
      }
    )
    const coinContract = new web3.eth.Contract(
      config.tokenABI,
      coinAddress,
      (error, result) => {
        if (error) console.log(error);
      }
    )
    // Generate filter options
    const sourceOptions = {
      fromBlock: "latest"
    };
    const dTokenOptions = {
      fromBlock: "latest",
      filter: {
        from: ethers.constants.AddressZero
      }
    }
    const coinOptions = {
      fromBlock: "latest",
      filter: {
        from: Object.values(config.dTokenDic),
        to: Object.values(config.destDic)
      }
    }

    // Subscribe to Transfer events matching filter criteria
    sourceContract.events
      .newTransfer(sourceOptions, async (error, event) => {
        if (error) {
          console.log("source_wsEndPoint =", wsEndPoint);
          console.log(error);
          return;
        }
        doDest(sourceContract, event);
        return;
      })
      .on("connected", async function (subscriptionId) {
        console.log(
          "source_subscriptionId =",
          subscriptionId,
          " time =",
          getTime(),
          "chain =",
          chain
        );
      });

    dTokenContract.events
      .Transfer(dTokenOptions, async (error, event) => {
        if (error) {
          console.log("source_wsEndPoint =", wsEndPoint);
          console.log(error);
          return;
        }
        doDToken(dTokenContract, null, event)
        return;
      })
      .on("connected", async function (subscriptionId) {
        console.log(
          "dToken_subscriptionId =",
          subscriptionId,
          " time =",
          getTime(),
          "chain =",
          chain
        );
      });

    coinContract.events
      .Transfer(coinOptions, async (error, event) => {
        if (error) {
          console.log("source_wsEndPoint =", wsEndPoint);
          console.log(error);
          return;
        }
        doDToken(null, null, event)
        return;
      })
      .on("connected", async function (subscriptionId) {
        console.log(
          "coin_subscriptionId =",
          subscriptionId,
          " time =",
          getTime(),
          "chain =",
          chain
        );
      });
  }
}

/**
 * 
 * @param  dTokenContract 1.from coinContract:null  2.from dTokenContract:dTokenContract
 * @param  toChainId 1.from event:null  2.from hand:chainId
 * @param  value event
 */
async function doDToken(dTokenContract, toChainId, value) {
  let fromAddress, toAddress, amount, dTokenAddress, destAddress, chain = null
  if (toChainId === null) {
    fromAddress = value.returnValues.from
    toAddress = value.returnValues.to
    amount = value.returnValues.value
    dTokenAddress = dTokenContract !== null ? dTokenContract._address : fromAddress
    destAddress = null
    chain = Object.entries(config.dTokenDic).find((item) => item[1] === dTokenAddress)[0]
    destAddress = config.destDic[chain]
  } else {
    chain = toChainId
    dTokenAddress = config.dTokenDic[chain]
    fromAddress = dTokenAddress
    destAddress = config.destDic[chain]
    toAddress = destAddress
    amount = ethers.BigNumber.from(0)
  }
  if (dTokenContract === null) {
    let provider = new ethers.providers.JsonRpcProvider(
      config[chain].httpEndPoint
    );
    dTokenContract = new ethers.Contract(
      dTokenAddress,
      config.dTokenABI,
      provider
    );
  }
  await addUserOrRevenue(fromAddress, toAddress, dTokenAddress, destAddress, amount, dTokenContract, chain)
}

async function doDest(sourceContract, value) {

  console.log("returnValue =", value);

  let amountToSend = value.returnValues.amount;
  let dest = value.returnValues.dest;
  let fee = value.returnValues.fee;
  let txindex = Number(value.returnValues.txindex);
  let chain = value.returnValues.chainId;
  let searchIndex = 0;
  let isFork = true;
  let workindex = 0;

  if (hashArray[chain].indexOf(value.transactionHash) !== -1) {
    return;
  }
  hashArray[chain].push(value.transactionHash);
  console.log("txindex =", txindex);
  console.log("amountToSend =", amountToSend);
  console.log("dest =", dest);
  console.log("chain =", chain);

  let tx = "0x0000000000000000000000000000000000000000000000000000000000000000";

  // Get last hashOnion from sourceContract events
  if (txindex > 1) {
    if (txindex % workLimit === 1) {
      searchIndex = txindex - workLimit;
      // zfork
    } else {
      // When workLimit = 5
      // If txindex = 4, workindex = 4 % 5 - 1 = 3
      // If txindex = 5, workindex = 5 - 1 = 4
      workindex =
        txindex % workLimit ? (txindex % workLimit) - 1 : workLimit - 1;
      searchIndex = txindex - workindex;
      isFork = false;
      //claim
    }

    // Generate filter options
    const options = {
      filter: {
        txindex: searchIndex,
        chainId: chain,
      },
      fromBlock: "0",
    };

    console.log("searchIndex =", searchIndex);
    console.log("isFork =", isFork);
    console.log("workindex =", workindex);
    try {
      const events = await sourceContract.getPastEvents("newTransfer", options);
      console.log('events.length ==', events.length);
      if (events.length === 0) {
        console.log("no txindex info");
        return;
      }
      tx = events[0].returnValues.hashOnion;
    } catch (err) {
      console.log(err);
      return
    }
  }

  await sendTransaction.send(
    Number(chain),
    dest,
    amountToSend,
    fee,
    tx,
    0,
    workindex,
    isFork
  );

  bondParams[chain]._transferDatas.push({
    destination: dest,
    amount: amountToSend,
    fee: fee,
  });
  bondParams[chain]._committers.push(config.makerAddress);

  try {
    let data = { bondParams, hashArray }
    await saveConfig(bondParamsAndHashKey, data)
  } catch (error) {
    console.log('bondParamsConifg error ==> ', error);
  }

  // When workindex == worklimit - 1, deposit current zFork
  if (workindex == workLimit - 1) {
    if (bondParams[chain].prevForkKey === "") {
      let currentHashOnion = ethers.constants.HashZero;
      bondParams[chain].prevForkKey = generateForkKey(chain, currentHashOnion)
    }

    const forkKey = generateForkKey(chain, tx);
    console.warn("tx >>>>>> ", tx);
    console.warn("forkKey >>>>>> ", forkKey);
    console.warn("prevForkKey >>>>>>", bondParams[chain].prevForkKey)

    try {
      await depositZFork(chain, forkKey);

    } catch (error) {
      console.log('depositZFork error = ', error);

    } finally {
      bondParams[chain].prevForkKey = forkKey;
      bondParams[chain]._transferDatas = [];
      bondParams[chain]._committers = [];

      try {
        let data = { bondParams, hashArray }
        await saveConfig(bondParamsAndHashKey, data)
      } catch (error) {
        console.log('bondParamsConifg second error ==> ', error);
      }
    }
  }
}

async function depositZFork(toChainId, forkKey) {
  // Deep copy bondParams
  const currentBondParams = JSON.parse(JSON.stringify(bondParams[toChainId]));

  const provider = new ethers.providers.JsonRpcProvider(
    config[toChainId].httpEndPoint
  );
  const singer = new ethers.Wallet(config.privatekey, provider);
  const destContract = new ethers.Contract(
    config.destDic[toChainId],
    config.destABI,
    singer
  );

  // Approve
  await erc20Approve(
    singer,
    config.tokenDic[toChainId],
    config.destDic[toChainId]
  );

  const respDeposit = await destContract.depositWithOneFork(forkKey, await getPolygonMumbaiFastPerGas());
  console.log("respDeposit ::: ", respDeposit);

  if (
    currentBondParams.prevForkKey == "" ||
    currentBondParams._transferDatas.length != workLimit ||
    currentBondParams._committers.length != workLimit
  ) {
    console.log('currentBondParams.prevForkKey ===> ', currentBondParams.prevForkKey);
    console.log('currentBondParams._transferDatas.length ===> ', currentBondParams._transferDatas.length);
    console.log('currentBondParams._committers.length ===> ', currentBondParams._committers.length);
    return;
  }

  const min = 5

  await earlyBond(toChainId, forkKey, destContract, currentBondParams, min)

  let revenueSatus = await getRevenueFlag(toChainId, min + 1)
  if (revenueSatus === false) {
    await doDToken(null, toChainId, null)
    console.log('Refresh user revenue manually succeeded');
  }
  console.log('early Bond succeeded');
}

// EarlyBond in backgroup
async function earlyBond(toChainId, forkKey, destContract, currentBondParams, min) {
  // Wait a minute
  await sleep(60 * 1000);
  // Invoke earlyBond every 1 minute
  const startTime = new Date().getTime();
  const endTime = 60000 * min
  while (new Date().getTime() - startTime < endTime) {
    try {
      console.warn("EarlyBond:::", new Date());
      await sleep(60 * 1000);
      const { hash } = await destContract.earlyBond(
        toChainId,
        currentBondParams.prevForkKey,
        forkKey,
        currentBondParams._transferDatas,
        currentBondParams._committers,
        await getPolygonMumbaiFastPerGas()
      );
      console.warn('EarlyBond hash: ', hash);
    } catch (err) {
      console.error("EarlyBond failed: " + err.message);
    }
  }
}

function getTime() {
  var time = sd.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  return time;
}

/**
 * @param {ethers.Signer} singer
 * @param {string} addressOrName
 * @param {string} spender
 */
async function erc20Approve(singer, addressOrName, spender) {
  const tokenContract = new ethers.Contract(
    addressOrName,
    config.tokenABI,
    singer
  );

  const allowance = await tokenContract.allowance(
    await singer.getAddress(),
    spender
  );
  console.warn("allowance:::", allowance + "");
  if (allowance.lte(ethers.utils.parseEther("10"))) {
    await tokenContract.approve(spender, ethers.constants.MaxUint256);
  }
}

/**
 * Generate fork's key
 * @param {number} chainId
 * @param {string} hashOnion
 * @param {number} index
 * @returns
 */
function generateForkKey(chainId, hashOnion, index = 0) {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint256", "bytes32", "uint16"],
      [chainId, hashOnion, index]
    )
  );
}

async function getPolygonMumbaiFastPerGas() {
  const response = await axios.get(
    'https://gasstation-mumbai.matic.today/v2'
  )
  const data = await response.data
  const fastPerGas = Math.trunc(data['fast']['maxFee'] * 10 ** 9)
  const options = {
    gasLimit: 3000000,
    maxPriorityFeePerGas: fastPerGas,
    maxFeePerGas: fastPerGas,
  }
  return options
}



