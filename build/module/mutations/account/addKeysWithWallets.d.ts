export declare const ADD_KEYS_WITH_WALLETS_MUTATION: any;
interface WalletInput {
    address: string;
    blockchain: string;
    chainIndex: number;
    publicKey: string;
}
export interface AddKeysArgs {
    encryptedSecretKey: string;
    encryptedSecretKeyNonce: string;
    encryptedSecretKeyTag: string;
    signaturePublicKey: string;
    wallets: WalletInput[];
}
export interface AddKeysResult {
    addKeysWithWallets: {
        id: string;
        email: string;
        twoFactor: boolean;
        creatingAccount: boolean;
        verified: boolean;
        encryptedSecretKey: string;
        encryptedSecretKeyNonce: string;
        encryptedSecretKeyTag: string;
        loginErrorCount: number;
        twoFactorErrorCount: string;
        wallets: {
            address: string;
            blockchain: string;
            chainIndex: number;
            publicKey: string;
        };
    };
}
export {};
