export var Networks;
(function (Networks) {
    Networks["MainNet"] = "https://explorer.neo.nash.io/api/main_net";
    Networks["TestNet"] = "TestNet";
    // TODO: Needs to be just NexNet - there is a bug in nex-wrapper
    Networks["NexNet"] = "https://nex.neoscan-testnet.io/api/test_net";
    Networks["LocalNet"] = "http://127.0.0.1:7000/api/main_net";
    Networks["Staging"] = "https://neo-local-explorer.staging.nash.io/api/main_net";
    Networks["Master"] = "https://neo-local-explorer.master.nash.io/api/main_net";
    Networks["Sandbox"] = "https://explorer.neo.sandbox.nash.io/api/main_net";
    Networks["Dev1"] = "https://neo-local-explorer.dev1.nash.io/api/main_net";
    Networks["Dev2"] = "https://neo-local-explorer.dev2.nash.io/api/main_net";
    Networks["Dev3"] = "https://neo-local-explorer.dev3.nash.io/api/main_net";
    Networks["Dev4"] = "https://neo-local-explorer.dev4.nash.io/api/main_net";
    Networks["QA1"] = "https://neo-local-explorer.qa1.nash.io/api/main_net";
})(Networks || (Networks = {}));
const LOCAL_ETH_CONTRACTS = {
    vault: {
        contract: '0x396FDAd6b7C6BaC97B6A22499F6748FD1d36546F'
    }
};
export const ETH_NETWORK = {
    [Networks.MainNet]: {
        contracts: {
            vault: {
                contract: '0x00F2B67B5A5EC2FF88B2BE7D5A8D1A39D5929237'
            }
        },
        nodes: ['https://consensus.eth.nash.io']
    },
    [Networks.TestNet]: {
        contracts: {},
        nodes: ['http://rinkeby.infura.io/v3/e1b716940a374ec79271402b9a79d1e4']
    },
    [Networks.NexNet]: {
        contracts: {
            vault: {
                contract: '0xfd6936bead7c8790413Ca93b5Df02c651eF36124'
            }
        },
        nodes: [
            'http://35.245.154.230:8545',
            'http://35.246.228.42:8545',
            'http://35.197.94.238:8545'
        ]
    },
    [Networks.LocalNet]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['http://127.0.0.1:8545']
    },
    [Networks.Staging]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://eth-local-consensus.staging.nash.io']
    },
    [Networks.Master]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://eth-local-consensus.master.nash.io']
    },
    [Networks.Sandbox]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://consensus.eth.sandbox.nash.io']
    },
    [Networks.Dev1]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://eth-local-consensus.dev1.nash.io']
    },
    [Networks.Dev2]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://eth-local-consensus.dev2.nash.io']
    },
    [Networks.Dev3]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://eth-local-consensus.dev3.nash.io']
    },
    [Networks.Dev4]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://eth-local-consensus.dev4.nash.io']
    },
    [Networks.QA1]: {
        contracts: LOCAL_ETH_CONTRACTS,
        nodes: ['https://eth-local-consensus.qa1.nash.io']
    }
};
// Contracts for all environments except mainnet, testnet, and nexnet
const LOCAL_NEO_CONTRACTS = {
    staking: {
        contract: 'f65cfc6122c34b4201f4557ce8c2f15d4672ce67',
        address: 'AREkZQLmY3gS448gngCyvghTxYcYEf61ri'
    },
    vault: {
        contract: 'D9B2A9EF4982A96DDCC2C44D463AA688615F16EB',
        address: 'AdCuF41cwxL9LMMRoq5Tyu7P2YHJeph8Dj'
    },
    nexToken: '7991cdc8103a0eb8d3a68d6411d4b0c80d38d912'
};
export const NEO_NETWORK = {
    [Networks.MainNet]: {
        contracts: {
            staking: {
                contract: '50491c82d9a8c3d4a02b03134f9c8e2089ad4c38',
                address: 'ALuZLuuDssJqG2E4foANKwbLamYHuffFjg'
            },
            vault: {
                contract: 'E48DDE213EE6E51CBC0A888339B335DC6122D401',
                address: 'AFwYT3HDAwkTneE8JytrCG1MWAFaqBUmnr'
            },
            nexToken: '3a4acd3647086e7c44398aac0349802e6a171129'
        },
        nodes: [
            'https://m1.neo.nash.io:443',
            'https://m2.neo.nash.io:443',
            'https://m3.neo.nash.io:443',
            'https://m4.neo.nash.io:443',
            'https://m5.neo.nash.io:443'
        ]
    },
    [Networks.TestNet]: {
        contracts: {},
        nodes: [
            'https://t1.neo.nash.io:443',
            'https://t2.neo.nash.io:443',
            'http://seed1.ngd.network:20332',
            'http://seed2.ngd.network:20332',
            'http://seed3.ngd.network:20332'
        ]
    },
    [Networks.NexNet]: {
        contracts: {
            staking: {
                contract: '89df5b8ab3791626753b692e69c374a345f2e260',
                address: 'AQcAPRai7N8Sjw24w71VLM28GBW4DAXp2D'
            },
            vault: {
                contract: 'c20f1712e4f2aa4ceee8538ddd53751d7196e4cb',
                address: 'AaMxezKvutUMHXXDNmY2az8ePnTsvQgJsg'
            },
            nexToken: 'ae1046975d425243ce1b1d487c052c94075e205b'
        },
        nodes: [
            'http://5.35.241.70:10001',
            'http://5.35.241.70:10002',
            'http://5.35.241.70:10003'
        ]
    },
    [Networks.LocalNet]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'http://127.0.0.1:30333',
            'http://127.0.0.1:30334',
            'http://127.0.0.1:30335'
        ]
    },
    [Networks.Staging]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://neo-local-consensus.staging.nash.io/node1',
            'https://neo-local-consensus.staging.nash.io/node2',
            'https://neo-local-consensus.staging.nash.io/node3'
        ]
    },
    [Networks.Master]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://neo-local-consensus.master.nash.io/node1',
            'https://neo-local-consensus.master.nash.io/node2',
            'https://neo-local-consensus.master.nash.io/node3'
        ]
    },
    [Networks.Sandbox]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://consensus.neo.sandbox.nash.io/node1',
            'https://consensus.neo.sandbox.nash.io/node2',
            'https://consensus.neo.sandbox.nash.io/node3'
        ]
    },
    [Networks.Dev1]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://neo-local-consensus.dev1.nash.io/node1',
            'https://neo-local-consensus.dev1.nash.io/node2',
            'https://neo-local-consensus.dev1.nash.io/node3'
        ]
    },
    [Networks.Dev2]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://neo-local-consensus.dev2.nash.io/node1',
            'https://neo-local-consensus.dev2.nash.io/node2',
            'https://neo-local-consensus.dev2.nash.io/node3'
        ]
    },
    [Networks.Dev3]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://neo-local-consensus.dev3.nash.io/node1',
            'https://neo-local-consensus.dev3.nash.io/node2',
            'https://neo-local-consensus.dev3.nash.io/node3'
        ]
    },
    [Networks.Dev4]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://neo-local-consensus.dev4.nash.io/node1',
            'https://neo-local-consensus.dev4.nash.io/node2',
            'https://neo-local-consensus.dev4.nash.io/node3'
        ]
    },
    [Networks.QA1]: {
        contracts: LOCAL_NEO_CONTRACTS,
        nodes: [
            'https://neo-local-consensus.qa1.nash.io/node1',
            'https://neo-local-consensus.qa1.nash.io/node2',
            'https://neo-local-consensus.qa1.nash.io/node3'
        ]
    }
};
export const BTC_NETWORK = {
    [Networks.MainNet]: {
        nodes: ['https://btc-mainnet-explorer.nash.io'],
        name: 'MainNet'
    },
    [Networks.TestNet]: {
        nodes: ['https://btc-testnet-explorer.nash.io'],
        name: 'TestNet'
    },
    [Networks.NexNet]: {
        nodes: ['https://btc-local-explorer.nexnet.nash.io'],
        name: 'TestNet'
    },
    [Networks.LocalNet]: {
        nodes: ['https://btc-local-explorer.nash.io'],
        name: 'TestNet'
    },
    [Networks.Staging]: {
        nodes: ['https://btc-local-explorer.staging.nash.io'],
        name: 'TestNet'
    },
    [Networks.Master]: {
        nodes: ['https://btc-local-explorer.master.nash.io'],
        name: 'TestNet'
    },
    [Networks.Sandbox]: {
        nodes: ['https://btc-local-explorer.sandbox.nash.io'],
        name: 'TestNet'
    },
    [Networks.Dev1]: {
        nodes: ['/btc-explorer-dev1'],
        name: 'TestNet'
    },
    [Networks.Dev2]: {
        nodes: ['/btc-explorer-dev2'],
        name: 'TestNet'
    },
    [Networks.Dev3]: {
        nodes: ['/btc-explorer-dev3'],
        name: 'TestNet'
    },
    [Networks.Dev4]: {
        nodes: ['/btc-explorer-dev4'],
        name: 'TestNet'
    },
    [Networks.QA1]: {
        nodes: ['/btc-explorer-qa1'],
        name: 'TestNet'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29ya3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L25ldHdvcmtzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBTixJQUFZLFFBY1g7QUFkRCxXQUFZLFFBQVE7SUFDbEIsaUVBQXFELENBQUE7SUFDckQsK0JBQW1CLENBQUE7SUFDbkIsZ0VBQWdFO0lBQ2hFLGtFQUFzRCxDQUFBO0lBQ3RELDJEQUErQyxDQUFBO0lBQy9DLCtFQUFtRSxDQUFBO0lBQ25FLDZFQUFpRSxDQUFBO0lBQ2pFLHlFQUE2RCxDQUFBO0lBQzdELHlFQUE2RCxDQUFBO0lBQzdELHlFQUE2RCxDQUFBO0lBQzdELHlFQUE2RCxDQUFBO0lBQzdELHlFQUE2RCxDQUFBO0lBQzdELHVFQUEyRCxDQUFBO0FBQzdELENBQUMsRUFkVyxRQUFRLEtBQVIsUUFBUSxRQWNuQjtBQXNCRCxNQUFNLG1CQUFtQixHQUFpQztJQUN4RCxLQUFLLEVBQUU7UUFDTCxRQUFRLEVBQUUsNENBQTRDO0tBQ3ZEO0NBQ0YsQ0FBQTtBQUVELE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBMEI7SUFDaEQsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDbEIsU0FBUyxFQUFFO1lBQ1QsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSw0Q0FBNEM7YUFDdkQ7U0FDRjtRQUNELEtBQUssRUFBRSxDQUFDLCtCQUErQixDQUFDO0tBQ3pDO0lBQ0QsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDbEIsU0FBUyxFQUFFLEVBQUU7UUFDYixLQUFLLEVBQUUsQ0FBQyw4REFBOEQsQ0FBQztLQUN4RTtJQUNELENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2pCLFNBQVMsRUFBRTtZQUNULEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsNENBQTRDO2FBQ3ZEO1NBQ0Y7UUFDRCxLQUFLLEVBQUU7WUFDTCw0QkFBNEI7WUFDNUIs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