module.exports = {
  5: {
    wsEndPoint: "wss://eth-rinkeby.alchemyapi.io/v2/APIKEY",
    httpEndPoint: "https://eth-rinkeby.alchemyapi.io/v2/APIKEY",
    gasPrice: "10",
    chainID: 4
  },
  22: {
    wsEndPoint: "wss://arb-rinkeby.g.alchemy.com/v2/APIKEY",
    httpEndPoint: "https://arb-rinkeby.g.alchemy.com/v2/APIKEY",
    gasPrice: "10",
    chainID: 421611
  },
  77: {
    wsEndPoint: "wss://opt-kovan.g.alchemy.com/v2/APIKEY",
    httpEndPoint: "https://opt-kovan.g.alchemy.com/v2/APIKEY",
    chainID: 69
  },
  makerAddress: "yourAddress",
  privatekey: "privateKey",
  destDic: {
    5: "0x06bcb27827dEA0c76ea0975c9d26E7Ec239B6cC0",
    22: "0xeda8D1c38074263d4e174D37857E66f948CF8aD5",
    77: "0x1aB15C4Ef458b45e1a7Ed3Ef1e534B71b8c5113c"
  },

  sourceDic: {
    5: "0x11d3985F79EC388077C930A9F8619CeDBB22b840",
    22: "0x27a4DcB2846bebcE415b6fc406cF8bFCB5d1055c",
    77: "0xf3c3988609cB90b0C64e5De511eE27D3A6d703f1"
  },

  tokenDic: {
    5: "0x9C37dB6B4ddd21d6C0ef89065c1C353719fc63aB",
    22: "0x750Bf8642CCe3644A0E434026f5Bd392bA13d1F1",
    77: "0xf1F75cd394D76065d836DD58E93c4c8e9a003D6E"
  },

  destABI: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "txIndex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32"
        }
      ],
      name: "newBond",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "dest",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fee",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "txindex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32"
        }
      ],
      name: "newClaim",
      type: "event"
    },
    {
      inputs: [],
      name: "ONEFORK_MAX_LENGTH",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "becomeCommiter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_forkKey",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_forkId",
          type: "uint256"
        }
      ],
      name: "buyOneFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "preHashOnion",
          type: "bytes32"
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256"
            }
          ],
          internalType: "struct Data.TransferData",
          name: "_transferData",
          type: "tuple"
        }
      ],
      name: "buyOneOnion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256"
        },
        {
          internalType: "bytes32",
          name: "_forkKey",
          type: "bytes32"
        },
        {
          internalType: "uint256",
          name: "_forkIndex",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "_workIndex",
          type: "uint256"
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256"
            }
          ],
          internalType: "struct Data.TransferData[]",
          name: "_transferDatas",
          type: "tuple[]"
        },
        {
          internalType: "bool[]",
          name: "_isResponds",
          type: "bool[]"
        }
      ],
      name: "claim",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      name: "commiterDeposit",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "hashOnionForks",
      outputs: [
        {
          internalType: "bytes32",
          name: "onionHead",
          type: "bytes32"
        },
        {
          internalType: "bytes32",
          name: "destOnionHead",
          type: "bytes32"
        },
        {
          internalType: "uint256",
          name: "allAmount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "length",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "lastCommiterAddress",
          type: "address"
        },
        {
          internalType: "bool",
          name: "needBond",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_lastOnionHead",
          type: "bytes32"
        },
        {
          internalType: "bytes32",
          name: "_lastDestOnionHead",
          type: "bytes32"
        },
        {
          internalType: "uint8",
          name: "_index",
          type: "uint8"
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256"
            }
          ],
          internalType: "struct Data.TransferData",
          name: "_transferData",
          type: "tuple"
        },
        {
          internalType: "bool",
          name: "_isRespond",
          type: "bool"
        }
      ],
      name: "mFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "bytes32",
              name: "forkKey",
              type: "bytes32"
            },
            {
              internalType: "uint256",
              name: "forkIndex",
              type: "uint256"
            },
            {
              internalType: "bytes32[]",
              name: "wrongtxHash",
              type: "bytes32[]"
            }
          ],
          internalType: "struct IDestinationContract.MForkData[]",
          name: "_mForkDatas",
          type: "tuple[]"
        },
        {
          internalType: "bytes32",
          name: "_preForkKey",
          type: "bytes32"
        },
        {
          internalType: "uint256",
          name: "_preForkIndex",
          type: "uint256"
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256"
            }
          ],
          internalType: "struct Data.TransferData[]",
          name: "_transferDatas",
          type: "tuple[]"
        },
        {
          internalType: "address[]",
          name: "_commiters",
          type: "address[]"
        }
      ],
      name: "mbond",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "onWorkHashOnion",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_sourceHashOnion",
          type: "bytes32"
        }
      ],
      name: "setHashOnion",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "sourceHashOnion",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256"
        },
        {
          internalType: "bytes32",
          name: "_forkKey",
          type: "bytes32"
        },
        {
          internalType: "uint8",
          name: "_index",
          type: "uint8"
        },
        {
          internalType: "address",
          name: "dest",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "fee",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "_isRespond",
          type: "bool"
        }
      ],
      name: "zFork",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_forkKey",
          type: "bytes32"
        },
        {
          internalType: "bytes32",
          name: "_preForkKey",
          type: "bytes32"
        },
        {
          internalType: "uint256",
          name: "_preForkIndex",
          type: "uint256"
        },
        {
          components: [
            {
              internalType: "address",
              name: "destination",
              type: "address"
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256"
            },
            {
              internalType: "uint256",
              name: "fee",
              type: "uint256"
            }
          ],
          internalType: "struct Data.TransferData[]",
          name: "_transferDatas",
          type: "tuple[]"
        },
        {
          internalType: "address[]",
          name: "_commiters",
          type: "address[]"
        }
      ],
      name: "zbond",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ],
  sourceABI: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_l2Messenger",
          type: "address"
        },
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "txIndex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32"
        }
      ],
      name: "extract",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "txindex",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "bytes32",
          name: "hashOnion",
          type: "bytes32"
        },
        {
          indexed: false,
          internalType: "address",
          name: "dest",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fee",
          type: "uint256"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "chainId",
          type: "uint256"
        }
      ],
      name: "newTransfer",
      type: "event"
    },
    {
      inputs: [],
      name: "ONEFORK_MAX_LENGTH",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      name: "chainId_Onions",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "raley",
          type: "address"
        }
      ],
      name: "extractHashOnionAndBalance",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [],
      name: "hashOnion",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "l2Messenger",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "tokenAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "fee",
          type: "uint256"
        }
      ],
      name: "transfer",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "dest",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "fee",
          type: "uint256"
        }
      ],
      name: "transferWithDest",
      outputs: [],
      stateMutability: "payable",
      type: "function"
    }
  ],
  tokenABI: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "initialBalance",
          type: "uint256"
        }
      ],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Approval",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address"
        },
        {
          internalType: "address",
          name: "spender",
          type: "address"
        }
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256"
        }
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256"
        }
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address"
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    }
  ]
};
