import { Blockchain } from '../types';
export declare function checkMandatoryParams(...args: Array<Record<string, any>>): void;
/**
 *
 * Bitcoin (34 chars starts with 1 or 3, or 42 chars starts with 1bc)
 * 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2
 * 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
 *
 * Eth  (40 chars without the 0x prefix)
 * 0x931d387731bbbc988b312206c74f77d004d6b84b
 * 0x6dda190f511537b96de2dd7b9943560c1c6425b4
 * 0x931d387731bbbc988b312206c74f77d004d6b84b
 * 931d387731bbbc988b312206c74f77d004d6b84b
 *
 * neo: 34 chars, starts with uppercase A:
 * AStoGW3erfFsoJnmquGi4bXgLrc4iDCu5h
 * AbxmHkpmvWWx3owu3u9BLSeyRS4kUh7mGy
 * ATjyK5FMPke8wMehARKT8h9XTatJZWfmaN
 */
export declare const detectBlockchain: (address: string) => Blockchain;
export declare function sleep(ms: number): Promise<unknown>;
export declare const sanitizeAddMovementPayload: (payload: {
    recycled_orders: [];
    resigned_orders: [];
    recycledOrders: [];
    resignedOrders: [];
    digests: [];
    signed_transaction_elements: [];
    signedTransactionElements: [];
}) => {
    recycled_orders: [];
    resigned_orders: [];
    recycledOrders: [];
    resignedOrders: [];
    digests: [];
    signed_transaction_elements: [];
    signedTransactionElements: [];
};
export declare const findBestNetworkNode: (nodes: any) => Promise<string>;
