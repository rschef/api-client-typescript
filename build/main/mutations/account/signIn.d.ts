export declare const SIGN_IN_MUTATION: any;
export interface SignInArgs {
    email: string;
    password: string;
}
export interface SignInResult {
    signIn: {
        account: {
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
            wallets: Array<{
                address: string;
                blockchain: string;
                chainIndex: number;
                publicKey: string;
            }>;
        };
        serverEncryptionKey: string;
        twoFaRequired: boolean;
    };
}
