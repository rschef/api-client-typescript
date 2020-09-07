"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementABI = [
    {
        constant: true,
        inputs: [],
        name: 'withdrawalWait',
        outputs: [
            {
                name: '',
                type: 'uint16'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [
            {
                name: '',
                type: 'address'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'locked',
        outputs: [
            {
                name: '',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_newOwner',
                type: 'address'
            }
        ],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'from',
                type: 'address'
            },
            {
                indexed: false,
                name: 'assetIds',
                type: 'uint16[]'
            },
            {
                indexed: false,
                name: 'amounts',
                type: 'uint64[]'
            }
        ],
        name: 'OnBalanceQuery',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'stateUpdates',
                type: 'bytes'
            }
        ],
        name: 'OnBalancesSync',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'from',
                type: 'address'
            },
            {
                indexed: false,
                name: 'assetFromId',
                type: 'uint16'
            },
            {
                indexed: false,
                name: 'assetToId',
                type: 'uint16'
            },
            {
                indexed: false,
                name: 'assetFromNonce',
                type: 'uint32'
            },
            {
                indexed: false,
                name: 'assetToNonce',
                type: 'uint32'
            },
            {
                indexed: false,
                name: 'orderNonce',
                type: 'uint32'
            },
            {
                indexed: false,
                name: 'actualAmount',
                type: 'uint64'
            },
            {
                indexed: false,
                name: 'actualOrderRate',
                type: 'uint64'
            },
            {
                indexed: false,
                name: 'actualFeeRate',
                type: 'uint64'
            }
        ],
        name: 'OnFillOrder',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'from',
                type: 'address'
            },
            {
                indexed: false,
                name: 'assetId',
                type: 'uint16'
            },
            {
                indexed: false,
                name: 'amount',
                type: 'uint64'
            },
            {
                indexed: false,
                name: 'nonce',
                type: 'uint32'
            },
            {
                indexed: false,
                name: 'userPubKey',
                type: 'address'
            },
            {
                indexed: false,
                name: 'userSig',
                type: 'bytes'
            },
            {
                indexed: false,
                name: 'meSig',
                type: 'bytes'
            }
        ],
        name: 'OnDeposit',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'from',
                type: 'address'
            },
            {
                indexed: false,
                name: 'assetId',
                type: 'uint16'
            },
            {
                indexed: false,
                name: 'amount',
                type: 'uint64'
            },
            {
                indexed: false,
                name: 'nonce',
                type: 'uint32'
            },
            {
                indexed: false,
                name: 'userPubKey',
                type: 'address'
            },
            {
                indexed: false,
                name: 'userSig',
                type: 'bytes'
            },
            {
                indexed: false,
                name: 'meSig',
                type: 'bytes'
            }
        ],
        name: 'OnWithdrawalComplete',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'from',
                type: 'address'
            }
        ],
        name: 'OnInitiateManualWithdrawal',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'from',
                type: 'address'
            },
            {
                indexed: false,
                name: 'assetId',
                type: 'uint16'
            },
            {
                indexed: false,
                name: 'amount',
                type: 'uint64'
            },
            {
                indexed: false,
                name: 'nonce',
                type: 'uint32'
            }
        ],
        name: 'OnManualWithdrawalComplete',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'addr',
                type: 'address'
            }
        ],
        name: 'OnAddedWhitelistAdmin',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'addr',
                type: 'address'
            }
        ],
        name: 'OnRemovedWhitelistAdmin',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'mePubKey',
                type: 'address'
            }
        ],
        name: 'OnAddedMatchingEngineKey',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: 'mePubKey',
                type: 'address'
            }
        ],
        name: 'OnRemovedMatchingEngineKey',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'previousOwner',
                type: 'address'
            }
        ],
        name: 'OwnershipRenounced',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'previousOwner',
                type: 'address'
            },
            {
                indexed: true,
                name: 'newOwner',
                type: 'address'
            }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            },
            {
                name: 'assetIds',
                type: 'uint16[]'
            }
        ],
        name: 'getBalances',
        outputs: [
            {
                name: '',
                type: 'uint64[]'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getTradingBalances',
        outputs: [
            {
                name: '',
                type: 'uint64[]'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getContractBalances',
        outputs: [
            {
                name: '',
                type: 'uint64[]'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            },
            {
                name: 'wlType',
                type: 'uint8'
            }
        ],
        name: 'getWhitelistStatus',
        outputs: [
            {
                name: '',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            }
        ],
        name: 'initiateManualWithdrawal',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            },
            {
                name: 'assetId',
                type: 'uint16'
            }
        ],
        name: 'completeManualWithdrawal',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'stateUpdates',
                type: 'bytes'
            },
            {
                name: 'mePubKey',
                type: 'address'
            },
            {
                name: 'meSig',
                type: 'bytes'
            }
        ],
        name: 'syncStates',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            },
            {
                name: 'assetId',
                type: 'uint16'
            },
            {
                name: 'amount',
                type: 'uint64'
            },
            {
                name: 'nonce',
                type: 'uint32'
            },
            {
                name: 'userPubKey',
                type: 'address'
            },
            {
                name: 'userSig',
                type: 'bytes'
            },
            {
                name: 'meSig',
                type: 'bytes'
            }
        ],
        name: 'deposit',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            },
            {
                name: 'assetId',
                type: 'uint16'
            },
            {
                name: 'amount',
                type: 'uint64'
            },
            {
                name: 'nonce',
                type: 'uint32'
            },
            {
                name: 'userPubKey',
                type: 'address'
            },
            {
                name: 'userSig',
                type: 'bytes'
            },
            {
                name: 'meSig',
                type: 'bytes'
            }
        ],
        name: 'sharedWithdrawal',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            },
            {
                name: 'assetIds',
                type: 'uint16[2]'
            },
            {
                name: 'assetNonces',
                type: 'uint32[2]'
            },
            {
                name: 'amount',
                type: 'uint64'
            },
            {
                name: 'minMaxOrderRate',
                type: 'uint64[2]'
            },
            {
                name: 'maxFeeRate',
                type: 'uint64'
            },
            {
                name: 'nonce',
                type: 'uint32'
            },
            {
                name: 'mePubKey',
                type: 'address'
            },
            {
                name: 'userSig',
                type: 'bytes'
            },
            {
                name: 'meSig',
                type: 'bytes'
            },
            {
                name: 'actualAmount',
                type: 'uint64'
            },
            {
                name: 'actualOrderRate',
                type: 'uint64'
            },
            {
                name: 'actualFeeRate',
                type: 'uint64'
            }
        ],
        name: 'fillOrder',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'asset',
                type: 'address'
            },
            {
                name: 'numDecimals',
                type: 'uint8'
            }
        ],
        name: 'addSupportedAsset',
        outputs: [
            {
                name: '',
                type: 'uint16'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            }
        ],
        name: 'addWhitelistAdmin',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'addr',
                type: 'address'
            }
        ],
        name: 'removeWhitelistAdmin',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'mePubKey',
                type: 'address'
            }
        ],
        name: 'addMatchingEngineKey',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'mePubKey',
                type: 'address'
            }
        ],
        name: 'removeMatchingEngineKey',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: 'withdrawalTime',
                type: 'uint16'
            }
        ],
        name: 'setWithdrawalTimeout',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGxlbWVudEFCSS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jbGllbnQvYWJpL2V0aC9zZXR0bGVtZW50QUJJLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRWEsUUFBQSxhQUFhLEdBQWM7SUFDdEM7UUFDRSxRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixPQUFPLEVBQUU7WUFDUDtnQkFDRSxJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsUUFBUTthQUNmO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsS0FBSztRQUNkLGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ2pCO0lBQ0Q7UUFDRSxRQUFRLEVBQUUsS0FBSztRQUNmLE1BQU0sRUFBRSxFQUFFO1FBQ1YsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixPQUFPLEVBQUUsRUFBRTtRQUNYLE9BQU8sRUFBRSxLQUFLO1FBQ2QsZUFBZSxFQUFFLFlBQVk7UUFDN0IsSUFBSSxFQUFFLFVBQVU7S0FDakI7SUFDRDtRQUNFLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRTtZQUNQO2dCQUNFLElBQUksRUFBRSxFQUFFO2dCQUNSLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsS0FBSztRQUNkLGVBQWUsRUFBRSxNQUFNO1FBQ3ZCLElBQUksRUFBRSxVQUFVO0tBQ2pCO0lBQ0Q7UUFDRSxRQUFRLEVBQUUsSUFBSTtRQUNkLE1BQU0sRUFBRSxFQUFFO1FBQ1YsSUFBSSxFQUFFLFFBQVE7UUFDZCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxJQUFJLEVBQUUsRUFBRTtnQkFDUixJQUFJLEVBQUUsTUFBTTthQUNiO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsS0FBSztRQUNkLGVBQWUs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