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
let bondParamsAndHashKey = 'bondParamsAndHashConfig'
const workLimit = 5;
testExpress();

async function testExpress() {
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
      await sendTransaction.becomeCommit(77);
      status = false
    } catch (error) {
      console.error("commiter_error =", error);
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

  for (let fromIndex = 0; fromIndex < sourceKeyList.length; fromIndex++) {
    const fromChain = sourceKeyList[fromIndex];
    const contractAddress = config.sourceDic[fromChain];
    const dTokenAddress = config.dTokenDic[fromChain]
    const providers = config[fromChain];
    if (doInitBondParams) {
      let toChainBondParams = {}
      let toChainHashArray = {}
      let toChainList = JSON.parse(JSON.stringify(sourceKeyList));
      toChainList.splice(toChainList.indexOf(fromChain), 1)
      for (let toIndex = 0; toIndex < toChainList.length; toIndex++) {
        const toChain = toChainList[toIndex]
        let tmpHashArray = []
        let tmpBondParams = {
          prevForkKey: "",
          _transferDatas: [],
          _committers: [],
        }
        toChainHashArray[toChain] = tmpHashArray
        toChainBondParams[toChain] = tmpBondParams
      }
      bondParams[fromChain] = toChainBondParams
      hashArray[fromChain] = toChainHashArray
    }
    watchPool(contractAddress, dTokenAddress, providers, fromChain, true);
  }
  return "start Maker";
}

function watchPool(sourceAddress, dTokenAddress, providers, fromChain, isSource) {
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

    // Generate filter options
    const sourceOptions = {
      fromBlock: "latest"
    };
    const dTokenOptions = {
      fromBlock: "latest"
    }
    // Subscribe to Transfer events matching filter criteria
    sourceContract.events
      .newTransfer(sourceOptions, async (error, event) => {
        if (error) {
          console.log("source_wsEndPoint =", wsEndPoint);
          console.log(error);
          return;
        }
        doDest(sourceContract, event, fromChain);
        return;
      })
      .on("connected", async function (subscriptionId) {
        console.log(
          "source_subscriptionId =",
          subscriptionId,
          " time =",
          getTime(),
          "chain =",
          fromChain
        );
      });

    dTokenContract.events
      .mintTransfer(dTokenOptions, async (error, event) => {
        if (error) {
          console.log("dToken mintTransfer=", wsEndPoint);
          console.log(error);
          return;
        }
        doDToken(dTokenContract, event, true)
        return;
      })
      .on("connected", async function (subscriptionId) {
        console.log(
          "dToken_subscriptionId =",
          subscriptionId,
          " time =",
          getTime(),
          "chain =",
          fromChain
        );
      });

    dTokenContract.events
      .BorrowTransfer(dTokenOptions, async (error, event) => {
        if (error) {
          console.log("dToken BorrowTransfer=", wsEndPoint);
          console.log(error);
          return;
        }
        doDToken(dTokenContract, event, false)
        return;
      })
      .on("connected", async function (subscriptionId) {
        console.log(
          "dToken_subscriptionId =",
          subscriptionId,
          " time =",
          getTime(),
          "chain =",
          fromChain
        );
      });


  }
}

/**
 * 
 * @param  dTokenContract 
 * @param  value event
 * @param  status mintTransfer:true BorrowTransfer:false
 */
async function doDToken(dTokenContract, value, status) {
  let accountOrAmount, dTokenAddress, chain = null
  if (status) {
    accountOrAmount = value.returnValues.minter
  } else {
    accountOrAmount = value.returnValues.borrowAmount
  }
  dTokenAddress = dTokenContract._address
  chain = Object.entries(config.dTokenDic).find((item) => item[1] === dTokenAddress)[0]
  await addUserOrRevenue(accountOrAmount, dTokenAddress, dTokenContract, chain)
}

async function doDest(sourceContract, value, fromChain) {

  console.log("returnValue =", value);

  let amountToSend = value.returnValues.amount;
  let dest = value.returnValues.dest;
  let fee = value.returnValues.fee;
  let txindex = Number(value.returnValues.txindex);
  let toChain = value.returnValues.chainId;
  let searchIndex = 0;
  let isFork = true;
  let workindex = 0;

  if (hashArray[fromChain][toChain].indexOf(value.transactionHash) !== -1) {
    return;
  }
  hashArray[fromChain][toChain].push(value.transactionHash);
  console.log("txindex =", txindex);
  console.log("amountToSend =", amountToSend);
  console.log("dest =", dest);
  console.log("toChain =", toChain);

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
        chainId: toChain,
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
    Number(toChain),
    Number(fromChain),
    dest,
    amountToSend,
    fee,
    tx,
    0,
    workindex,
    isFork
  );

  bondParams[fromChain][toChain]._transferDatas.push({
    destination: dest,
    amount: amountToSend,
    fee: fee,
  });
  bondParams[fromChain][toChain]._committers.push(config.makerAddress);

  try {
    let data = { bondParams, hashArray }
    await saveConfig(bondParamsAndHashKey, data)
  } catch (error) {
    console.log('bondParamsConifg error ==> ', error);
  }

  // When workindex == worklimit - 1, deposit current zFork
  if (workindex == workLimit - 1) {
    if (bondParams[fromChain][toChain].prevForkKey === "") {
      let currentHashOnion = ethers.constants.HashZero;
      bondParams[fromChain][toChain].prevForkKey = generateForkKey(fromChain, currentHashOnion)
    }

    const forkKey = generateForkKey(fromChain, tx);
    console.warn("tx >>>>>> ", tx);
    console.warn("forkKey >>>>>> ", forkKey);
    console.warn("prevForkKey >>>>>>", bondParams[fromChain][toChain].prevForkKey)

    try {
      await depositZFork(fromChain, toChain, forkKey);

    } catch (error) {
      console.log('depositZFork error = ', error);

    } finally {
      bondParams[fromChain][toChain].prevForkKey = forkKey;
      bondParams[fromChain][toChain]._transferDatas = [];
      bondParams[fromChain][toChain]._committers = [];

      try {
        let data = { bondParams, hashArray }
        await saveConfig(bondParamsAndHashKey, data)
      } catch (error) {
        console.log('bondParamsConifg second error ==> ', error);
      }
    }
  }
}

async function depositZFork(fromChain, toChain, forkKey) {
  // Deep copy bondParams
  const currentBondParams = JSON.parse(JSON.stringify(bondParams[fromChain][toChain]));
  const tokenAddress = config.tokenDic[toChain]
  const destAddress = config.destDic[toChain]
  const provider = new ethers.providers.JsonRpcProvider(
    config[toChain].httpEndPoint
  );
  const singer = new ethers.Wallet(config.privatekey, provider);
  const destContract = new ethers.Contract(
    destAddress,
    config.destABI,
    singer
  );

  if (tokenAddress !== ethers.constants.AddressZero) {
    // ERC20 Approve
    await erc20Approve(
      singer,
      tokenAddress,
      destAddress
    );
  }


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

  await earlyBond(toChain, forkKey, destContract, currentBondParams, min)

  let revenueSatus = await getRevenueFlag(toChain, min + 1)
  if (revenueSatus === false) {
    await doDToken(null, toChain, null)
    console.log('Refresh user revenue manually succeeded');
  }
  console.log('early Bond succeeded');
}

// EarlyBond in backgroup
async function earlyBond(toChain, forkKey, destContract, currentBondParams, min) {
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
        toChain,
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
  const decimals = await tokenContract.decimals()
  console.warn("allowance:::", allowance + "");
  if (allowance.lte(ethers.utils.parseUnits("10", decimals))) {
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



