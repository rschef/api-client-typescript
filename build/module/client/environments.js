import { NEO_NETWORK, BTC_NETWORK, Networks, ETH_NETWORK } from './networks';
export const EnvironmentConfiguration = {
    production: {
        host: 'app.nash.io',
        neoScan: 'https://neoscan.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.MainNet],
        neoNetworkSettings: NEO_NETWORK[Networks.MainNet],
        btcNetworkSettings: BTC_NETWORK[Networks.MainNet],
        isLocal: false
    },
    sandbox: {
        host: 'app.sandbox.nash.io',
        neoScan: 'https://explorer.neo.sandbox.nash.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.Sandbox],
        neoNetworkSettings: NEO_NETWORK[Networks.Sandbox],
        btcNetworkSettings: BTC_NETWORK[Networks.Sandbox],
        isLocal: false
    },
    master: {
        host: 'app.master.nash.io',
        neoScan: 'https://neo-local-explorer.master.nash.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.Master],
        neoNetworkSettings: NEO_NETWORK[Networks.Master],
        btcNetworkSettings: BTC_NETWORK[Networks.Master],
        isLocal: false
    },
    staging: {
        host: 'app.staging.nash.io',
        neoScan: 'https://neo-local-explorer.staging.nash.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.Staging],
        neoNetworkSettings: NEO_NETWORK[Networks.Staging],
        btcNetworkSettings: BTC_NETWORK[Networks.Staging],
        isLocal: false
    },
    dev1: {
        host: 'app.dev1.nash.io',
        neoScan: 'https://neo-local-explorer.dev1.nash.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.Dev1],
        neoNetworkSettings: NEO_NETWORK[Networks.Dev1],
        btcNetworkSettings: BTC_NETWORK[Networks.Dev1],
        isLocal: false
    },
    dev2: {
        host: 'app.dev2.nash.io',
        neoScan: 'https://neo-local-explorer.dev2.nash.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.Dev2],
        neoNetworkSettings: NEO_NETWORK[Networks.Dev2],
        btcNetworkSettings: BTC_NETWORK[Networks.Dev2],
        isLocal: false
    },
    dev3: {
        host: 'app.dev3.nash.io',
        neoScan: 'https://neo-local-explorer.dev3.nash.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.Dev3],
        neoNetworkSettings: NEO_NETWORK[Networks.Dev3],
        btcNetworkSettings: BTC_NETWORK[Networks.Dev3],
        isLocal: false
    },
    dev4: {
        host: 'app.dev4.nash.io',
        neoScan: 'https://neo-local-explorer.dev4.nash.io/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.Dev4],
        neoNetworkSettings: NEO_NETWORK[Networks.Dev4],
        btcNetworkSettings: BTC_NETWORK[Networks.Dev4],
        isLocal: false
    },
    local: {
        host: 'localhost:4000',
        neoScan: 'http://localhost:7000/api/test_net',
        ethNetworkSettings: ETH_NETWORK[Networks.LocalNet],
        neoNetworkSettings: NEO_NETWORK[Networks.LocalNet],
        btcNetworkSettings: BTC_NETWORK[Networks.LocalNet],
        isLocal: true
    },
    localDocker: {
        host: 'host.docker.internal:4000',
        neoScan: 'http://host.docker.internal:7000/api/test_net',
        ethNetworkSettings: ETH_NETWORK[Networks.LocalNet],
        neoNetworkSettings: NEO_NETWORK[Networks.LocalNet],
        btcNetworkSettings: BTC_NETWORK[Networks.LocalNet],
        isLocal: true
    },
    internal: {
        host: 'cas',
        neoScan: 'http://chain-local-neo/api/main_net',
        ethNetworkSettings: ETH_NETWORK[Networks.LocalNet],
        neoNetworkSettings: NEO_NETWORK[Networks.LocalNet],
        btcNetworkSettings: BTC_NETWORK[Networks.LocalNet],
        isLocal: true
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsaWVudC9lbnZpcm9ubWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQTtBQTJCNUUsTUFBTSxDQUFDLE1BQU0sd0JBQXdCLEdBQUc7SUFDdEMsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFLGFBQWE7UUFDbkIsT0FBTyxFQUFFLGlDQUFpQztRQUMxQyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxxQkFBcUI7UUFDM0IsT0FBTyxFQUFFLG1EQUFtRDtRQUM1RCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsT0FBTyxFQUFFLHdEQUF3RDtRQUNqRSxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNoRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNoRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUNoRCxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLE9BQU8sRUFBRTtRQUNQLElBQUksRUFBRSxxQkFBcUI7UUFDM0IsT0FBTyxFQUFFLHlEQUF5RDtRQUNsRSxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNqRCxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLHNEQUFzRDtRQUMvRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLHNEQUFzRDtRQUMvRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLHNEQUFzRDtRQUMvRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsT0FBTyxFQUFFLHNEQUFzRDtRQUMvRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztRQUM5QyxPQUFPLEVBQUUsS0FBSztLQUNNO0lBQ3RCLEtBQUssRUFBRTtRQUNMLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsT0FBTyxFQUFFLG9DQUFvQztRQUM3QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxPQUFPLEVBQUUsSUFBSTtLQUNPO0lBQ3RCLFdBQVcsRUFBRTtRQUNYLElBQUksRUFBRSwyQkFBMkI7UUFDakMsT0FBTyxFQUFFLCtDQUErQztRQUN4RCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxPQUFPLEVBQUUsSUFBSTtLQUNPO0lBQ3RCLFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxFQUFFLHFDQUFxQztRQUM5QyxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxrQkFBa0IsRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUNsRCxPQUFPLEVBQUUsSUFBSTtLQUNkO0NBQ0YsQ0FBQSJ9