"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const networks_1 = require("./networks");
exports.EnvironmentConfiguration = {
    production: {
        host: 'app.nash.io',
        neoScan: 'https://neoscan.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.MainNet],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.MainNet],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.MainNet],
        isLocal: false
    },
    sandbox: {
        host: 'app.sandbox.nash.io',
        neoScan: 'https://explorer.neo.sandbox.nash.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.Sandbox],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.Sandbox],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.Sandbox],
        isLocal: false
    },
    master: {
        host: 'app.master.nash.io',
        neoScan: 'https://neo-local-explorer.master.nash.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.Master],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.Master],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.Master],
        isLocal: false
    },
    staging: {
        host: 'app.staging.nash.io',
        neoScan: 'https://neo-local-explorer.staging.nash.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.Staging],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.Staging],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.Staging],
        isLocal: false
    },
    dev1: {
        host: 'app.dev1.nash.io',
        neoScan: 'https://neo-local-explorer.dev1.nash.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.Dev1],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.Dev1],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.Dev1],
        isLocal: false
    },
    dev2: {
        host: 'app.dev2.nash.io',
        neoScan: 'https://neo-local-explorer.dev2.nash.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.Dev2],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.Dev2],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.Dev2],
        isLocal: false
    },
    dev3: {
        host: 'app.dev3.nash.io',
        neoScan: 'https://neo-local-explorer.dev3.nash.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.Dev3],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.Dev3],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.Dev3],
        isLocal: false
    },
    dev4: {
        host: 'app.dev4.nash.io',
        neoScan: 'https://neo-local-explorer.dev4.nash.io/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.Dev4],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.Dev4],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.Dev4],
        isLocal: false
    },
    local: {
        host: 'localhost:4000',
        neoScan: 'http://localhost:7000/api/test_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.LocalNet],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.LocalNet],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.LocalNet],
        isLocal: true
    },
    localDocker: {
        host: 'host.docker.internal:4000',
        neoScan: 'http://host.docker.internal:7000/api/test_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.LocalNet],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.LocalNet],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.LocalNet],
        isLocal: true
    },
    internal: {
        host: 'cas',
        neoScan: 'http://chain-local-neo/api/main_net',
        ethNetworkSettings: networks_1.ETH_NETWORK[networks_1.Networks.LocalNet],
        neoNetworkSettings: networks_1.NEO_NETWORK[networks_1.Networks.LocalNet],
        btcNetworkSettings: networks_1.BTC_NETWORK[networks_1.Networks.LocalNet],
        isLocal: true
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9lbnZpcm9ubWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBNEU7QUEyQi9ELFFBQUEsd0JBQXdCLEdBQUc7SUFDdEMsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLGlDQUFpQztRQUMxQyxrQkFBa0IsRUFBRSxzQkFBVyxDQUFDLG1CQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2pELGtCQUFrQixFQUFFLHNCQUFXLENBQUMsbUJBQVEsQ0FBQyxPQUFPLENBQUM7UUFDakQsa0JBQWtCLEVBQUUsc0JBQVcsQ0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxxQkFBcUI7UUFDM0IsT0FBTyxFQUFFLG1EQUFtRDtRQUM1RCxrQkFBa0IsRUFBRSxzQkFBVyxDQUFDLG1CQUFRLENBQUMsT0FBTyxDQUFDO1FBQ2pELGtCQUFrQixFQUFFLHNCQUFXLENBQUMsbUJBQVEsQ0FBQyxPQUFPLENBQUM7UUFDakQsa0JBQWtCLEVBQUUsc0JBQVcsQ0FBQyxtQkFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsT0FBTyxFQUFFLHdEQUF3RDtRQUNqRSxrQkFBa0IsRUFBRSxzQkFBVyxDQUFDLG1CQUFRLENBQUMsTUFBTSxDQUFDO1FBQ2hELGtCQUFrQixFQUFFLHNCQUFXLENBQUMsbUJBQVEsQ0FBQyxNQUFNLENBQUM7UUFDaEQsa0JBQWtCLEVBQUUsc0JBQVcsQ0FBQyxtQkFBUSxDQUFDLE1BQU0sQ0FBQztRQUNoRCxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLE9BQU8sRUFBRTtRQUNQLElBQUks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