const dotenv = require("dotenv");
dotenv.config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const config = require("./config");
var sd = require("silly-datetime");
const sendTransaction = require("./sendTransaction");
const ethers = require("ethers");
const { sleep } = require("zksync/build/utils");

var web3List = [];

var hashArray = [];

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
      chainId: toChain,
    },
    fromBlock: "0",
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
    await sendTransaction.becomeCommit(5);
    await sendTransaction.becomeCommit(22);
    await sendTransaction.becomeCommit(77);
  } catch (error) {
    console.error("commiter_error =", error);
    return;
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
function startMaker() {
  if (web3List.length !== 0) {
    for (let index = 0; index < web3List.length; index++) {
      const web3 = web3List[index];
      web3.eth.clearSubscriptions();
    }
  }
  var sourceKeyList = Object.keys(config.sourceDic);

  for (let index = 0; index < sourceKeyList.length; index++) {
    const chain = sourceKeyList[index];
    const contractAddress = config.sourceDic[chain];
    const providers = config[chain];
    watchPool(contractAddress, providers, chain, true);
  }
  return "start Maker";
}
function watchPool(address, providers, chain, isSource) {
  // Instantiate web3 with WebSocketProvider
  let wsEndPoint = providers.wsEndPoint;
  let contractAddress = address;

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
    // Generate filter options
    const options = {
      fromBlock: "latest",
    };

    // Subscribe to Transfer events matching filter criteria
    sourceContract.events
      .newTransfer(options, async (error, event) => {
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
  }
}

// function doDest(sourceContract, value) {
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

  if (hashArray.indexOf(value.transactionHash) !== -1) {
    return;
  }
  hashArray.push(value.transactionHash);
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

      if (events.length === 0) {
        console.log("no txindex info");
        return;
      }

      tx = events[0].returnValues.hashOnion;
    } catch (err) {
      console.log(err);
      return;
    }
  }

  // await sendTransaction.send(
  //   Number(chain),
  //   dest,
  //   amountToSend,
  //   fee,
  //   tx,
  //   0,
  //   workindex,
  //   isFork
  // );

  // When workindex == worklimit - 1, deposit current zFork
  // if (workindex == workLimit - 1) {
  const forkKey = generateForkKey(chain, tx);
  depositZFork(chain, forkKey);
  // }
}

async function depositZFork(toChainId, forkKey) {
  // depositWithOneFork
  // depositWithOneFork

  const provider = new ethers.providers.JsonRpcProvider(
    config[toChainId].httpEndPoint
  );
  const singer = new ethers.Wallet(config.privatekey, provider);
  const destContract = new ethers.Contract(
    config.destDic[toChainId],
    config.destABI,
    singer
  );

  await destContract.depositWithOneFork(forkKey);

  // Invoke earlyBond at 10min after
  await sleep(10 * 60 * 1000);

//   function earlyBond(
//     uint256 chainId,
//     bytes32 prevForkKey,
//     bytes32 forkKey,
//     Data.TransferData[] calldata _transferDatas,
//     address[] calldata _committers
// ) external
  await destContract.earlyBond(toChainId)
}

function getTime() {
  var time = sd.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  return time;
}

/**
 * Generate fork's key
 * @param chainId
 * @param hashOnion
 * @param index
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
