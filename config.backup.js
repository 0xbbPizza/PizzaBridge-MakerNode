module.exports = {
  5: {
    wsEndPoint: "wss://eth-rinkeby.alchemyapi.io/v2/APIKEY",
    httpEndPoint: "https://eth-rinkeby.alchemyapi.io/v2/APIKEY",
    gasPrice: "10",
    chainID: 4,
  },
  22: {
    wsEndPoint: "wss://arb-rinkeby.g.alchemy.com/v2/APIKEY",
    httpEndPoint: "https://arb-rinkeby.g.alchemy.com/v2/APIKEY",
    gasPrice: "10",
    chainID: 421611,
  },
  77: {
    wsEndPoint: "wss://opt-kovan.g.alchemy.com/v2/APIKEY",
    httpEndPoint: "https://opt-kovan.g.alchemy.com/v2/APIKEY",
    chainID: 69,
  },
  makerAddress: "yourAddress",
  privatekey: "privateKey",
  destDic: {
    5: "0x1589fCC1322038392208ddE47bA09f8fCC1333C2",
    // TODO Watting Arbiturm netwrok ok
    // 22: "0x7DBB80Af9e383175A28f26F93Bc084dd11D4B140",
    77: "0x92158a56b52a6fe2bCcF42072f5AB0E4FD850bC9",
  },

  sourceDic: {
    5: "0x8C5484C03283401FE7b5Ae2901D45Eaf621dDc5e",
    // TODO Watting Arbiturm netwrok ok
    // 22: "0xd131370ae51E1E784023a800E6b7761FB04152ed",
    77: "0x5377c210524F0BCcF510Af6f1631f79618b3e356",
  },

  tokenDic: {
    5: "0x2e055eEe18284513B993dB7568A592679aB13188",
    // TODO Watting Arbiturm netwrok ok
    // 22: "0x575BEbf4C0aE051322b66B9141F6CB0ab5479226",
    77: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  },

  destABI: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_dockAddr",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "txIndex",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
      ],
      name: "newBond",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "dest",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fee",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "txindex",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
      ],
      name: "newClaim",
      type: "event",
    },
    {
      inputs: [],
      name: "DEPOSIT_AMOUNT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ONEFORK_MAX_LENGTH",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "source",
          type: "address",
        },
      ],
      name: "addDomain",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "becomeCommiter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "forkKeyNum",
          type: "uint256",
        },
      ],
      name: "blockDepositOneFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
      ],
      name: "bondSourceHashOnion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_forkKey",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_forkId",
          type: "uint256",
        },
      ],
      name: "buyOneFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "preHashOnion",
          type: "bytes32",
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256",
            },
          ],
          internalType: "struct Data.TransferData",
          name: "_transferData",
          type: "tuple",
        },
      ],
      name: "buyOneOnion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "workForkKey",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "_workIndex",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256",
            },
          ],
          internalType: "struct Data.TransferData[]",
          name: "_transferDatas",
          type: "tuple[]",
        },
        {
          internalType: "bool[]",
          name: "_isResponds",
          type: "bool[]",
        },
      ],
      name: "claim",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "forkKeyNum",
          type: "uint256",
        },
      ],
      name: "creatPToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "forkKey",
          type: "bytes32",
        },
      ],
      name: "depositWithOneFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
      ],
      name: "depositwithMutiMFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "dockAddr",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
        {
          internalType: "uint8",
          name: "index",
          type: "uint8",
        },
      ],
      name: "getHashOnionFork",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "onionHead",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "destOnionHead",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "allAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "length",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "lastCommiterAddress",
              type: "address",
            },
            {
              internalType: "bool",
              name: "needBond",
              type: "bool",
            },
          ],
          internalType: "struct Fork.Info",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
      ],
      name: "getHashOnionInfo",
      outputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "sourceHashOnion",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "onWorkHashOnion",
              type: "bytes32",
            },
          ],
          internalType: "struct HashOnions.Info",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      name: "hashOnionForks",
      outputs: [
        {
          internalType: "bytes32",
          name: "onionHead",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "destOnionHead",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "allAmount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "length",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "lastCommiterAddress",
          type: "address",
        },
        {
          internalType: "bool",
          name: "needBond",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "_lastOnionHead",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "_lastDestOnionHead",
          type: "bytes32",
        },
        {
          internalType: "uint8",
          name: "_index",
          type: "uint8",
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256",
            },
          ],
          internalType: "struct Data.TransferData",
          name: "_transferData",
          type: "tuple",
        },
        {
          internalType: "bool",
          name: "_isRespond",
          type: "bool",
        },
      ],
      name: "mFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "preWorkForkKey",
          type: "bytes32",
        },
        {
          components: [
            {
              internalType: "uint8",
              name: "forkIndex",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "forkKey",
              type: "bytes32",
            },
            {
              internalType: "bytes32[]",
              name: "wrongtxHash",
              type: "bytes32[]",
            },
          ],
          internalType: "struct Data.MForkData[]",
          name: "_mForkDatas",
          type: "tuple[]",
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256",
            },
          ],
          internalType: "struct Data.TransferData[]",
          name: "_transferDatas",
          type: "tuple[]",
        },
        {
          internalType: "address[]",
          name: "_commiters",
          type: "address[]",
        },
      ],
      name: "mbond",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "onion",
          type: "bytes32",
        },
        {
          internalType: "bool",
          name: "equal",
          type: "bool",
        },
      ],
      name: "setOnWorkHashOnion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "forkKeyNum",
          type: "uint256",
        },
      ],
      name: "settlement",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "workForkKey",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "dest",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "fee",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_isRespond",
          type: "bool",
        },
      ],
      name: "zFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "_preHashOnion",
          type: "bytes32",
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256",
            },
          ],
          internalType: "struct Data.TransferData[]",
          name: "_transferDatas",
          type: "tuple[]",
        },
        {
          internalType: "address[]",
          name: "_commiters",
          type: "address[]",
        },
      ],
      name: "zbond",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  sourceABI: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_dockAddr",
          type: "address",
        },
        {
          internalType: "address",
          name: "_sameDomainDestAddress",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "txIndex",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
      ],
      name: "extract",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "txindex",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "address",
          name: "dest",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fee",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
      ],
      name: "newTransfer",
      type: "event",
    },
    {
      inputs: [],
      name: "ONEFORK_MAX_LENGTH",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "destContract",
          type: "address",
        },
      ],
      name: "addDestDomain",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "chainId_Onions",
      outputs: [
        {
          internalType: "uint256",
          name: "txIndex",
          type: "uint256",
        },
        {
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "bringHashOnion",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "destAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "dockAddr",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_chainId",
          type: "uint256",
        },
      ],
      name: "extractHashOnion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "sameDomainDestAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "tokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "fee",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "dest",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "fee",
          type: "uint256",
        },
      ],
      name: "transferWithDest",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ],
  tokenABI: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "initialBalance",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
