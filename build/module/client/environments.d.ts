import { NEO_NETWORK, BTC_NETWORK, Networks, ETH_NETWORK } from './networks';
export interface EnvironmentConfig {
    host: string;
    maxEthCostPrTransaction?: string;
    debug?: boolean;
    neoScan?: string;
    neoNetworkSettings?: typeof NEO_NETWORK[Networks.MainNet];
    ethNetworkSettings?: typeof ETH_NETWORK[Networks.MainNet];
    btcNetworkSettings?: typeof BTC_NETWORK[Networks.MainNet];
    isLocal: boolean;
}
export interface ClientOptions {
    disableSocketReconnect?: boolean;
    runRequestsOverWebsockets?: boolean;
    enablePerformanceTelemetry?: boolean;
    performanceTelemetryTag?: string;
    affiliateCode?: string;
    affiliateLabel?: string;
    headers?: Record<string, string>;
    autoSignState?: boolean;
}
export declare const EnvironmentConfiguration: {
    production: EnvironmentConfig;
    sandbox: EnvironmentConfig;
    master: EnvironmentConfig;
    staging: EnvironmentConfig;
    dev1: EnvironmentConfig;
    dev2: EnvironmentConfig;
    dev3: EnvironmentConfig;
    dev4: EnvironmentConfig;
    local: EnvironmentConfig;
    localDocker: EnvironmentConfig;
    internal: {
        host: string;
        neoScan: string;
        ethNetworkSettings: import("./networks").NetworkSettings;
        neoNetworkSettings: import("./networks").NetworkSettings;
        btcNetworkSettings: import("./networks").NetworkSettings;
        isLocal: boolean;
    };
};
