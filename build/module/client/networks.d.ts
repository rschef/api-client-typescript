export declare enum Networks {
    MainNet = "https://explorer.neo.nash.io/api/main_net",
    TestNet = "TestNet",
    NexNet = "https://nex.neoscan-testnet.io/api/test_net",
    LocalNet = "http://127.0.0.1:7000/api/main_net",
    Staging = "https://neo-local-explorer.staging.nash.io/api/main_net",
    Master = "https://neo-local-explorer.master.nash.io/api/main_net",
    Sandbox = "https://explorer.neo.sandbox.nash.io/api/main_net",
    Dev1 = "https://neo-local-explorer.dev1.nash.io/api/main_net",
    Dev2 = "https://neo-local-explorer.dev2.nash.io/api/main_net",
    Dev3 = "https://neo-local-explorer.dev3.nash.io/api/main_net",
    Dev4 = "https://neo-local-explorer.dev4.nash.io/api/main_net",
    QA1 = "https://neo-local-explorer.qa1.nash.io/api/main_net"
}
export interface NetworkSettings {
    contracts?: {
        staking?: {
            contract?: string;
            address?: string;
        };
        vault?: {
            contract?: string;
            address?: string;
        };
        nexToken?: string;
    };
    nodes: string[];
    name?: string;
}
declare type NetworkSettingsRecord = Record<Networks, NetworkSettings>;
export declare const ETH_NETWORK: NetworkSettingsRecord;
export declare const NEO_NETWORK: NetworkSettingsRecord;
export declare const BTC_NETWORK: NetworkSettingsRecord;
export {};
