import { Blockchain } from '../types';
import fetch from 'node-fetch';
export function checkMandatoryParams(...args) {
    // should iterate over all received params and check if they match with their respective Type
    const errors = [];
    for (const arg of args) {
        const expectedType = arg.Type;
        for (const key of Object.keys(arg)) {
            if (key === 'Type') {
                continue;
            }
            const paramObj = arg[key];
            // if (typeof paramObj === 'object') {
            //   paramObj == paramObj[key]
            // }
            if (typeof paramObj === null || typeof paramObj === undefined) {
                errors.push(`${key} is missing, but required`);
            }
            if (typeof paramObj !== expectedType) {
                errors.push(`${key} must be of type ${expectedType}`);
            }
        }
    }
    if (errors.length === 0) {
        return;
    }
    throw new Error(errors.join('\n'));
}
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
// returns null if no blockchain addresses types were matched
export const detectBlockchain = (address) => {
    if (/^0x[0-9a-fA-F]{40}$/.test(address) ||
        /^[0-9a-fA-F]{40}$/.test(address)) {
        return Blockchain.ETH;
    }
    if (/^A[a-zA-Z0-9]{33}$/.test(address)) {
        return Blockchain.NEO;
    }
    if (/^1[a-zA-Z0-9]{33}$/.test(address) ||
        /^3[a-zA-Z0-9]{33}$/.test(address) ||
        /^bc1[a-zA-Z0-9]{39}$/.test(address)) {
        return Blockchain.BTC;
    }
    return null;
};
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export const sanitizeAddMovementPayload = (payload) => {
    const submitPayload = { ...payload };
    if (payload.recycled_orders != null ||
        payload.resigned_orders != null ||
        payload.recycledOrders != null) {
        delete submitPayload.recycled_orders;
        delete submitPayload.recycledOrders;
        submitPayload.resignedOrders = submitPayload.resigned_orders;
        delete submitPayload.resigned_orders;
    }
    if (payload.digests != null) {
        delete submitPayload.digests;
    }
    if (payload.signed_transaction_elements != null) {
        submitPayload.signedTransactionElements =
            payload.signed_transaction_elements;
        delete submitPayload.signed_transaction_elements;
    }
    return submitPayload;
};
export const findBestNetworkNode = async (nodes) => {
    for (const url of nodes) {
        try {
            const s = await fetch(url);
            if (s.status >= 400) {
                throw new Error('invalid');
            }
            return url;
        }
        catch (e) {
            console.info(url, 'is down. Trying next node');
        }
    }
    throw new Error('No neo nodes up');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpZW50L3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUE7QUFFckMsT0FBTyxLQUFLLE1BQU0sWUFBWSxDQUFBO0FBQzlCLE1BQU0sVUFBVSxvQkFBb0IsQ0FDbEMsR0FBRyxJQUFnQztJQUVuQyw2RkFBNkY7SUFDN0YsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO0lBQ2pCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ3RCLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7UUFFN0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2xDLElBQUksR0FBRyxLQUFLLE1BQU0sRUFBRTtnQkFDbEIsU0FBUTthQUNUO1lBQ0QsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3pCLHNDQUFzQztZQUN0Qyw4QkFBOEI7WUFDOUIsSUFBSTtZQUNKLElBQUksT0FBTyxRQUFRLEtBQUssSUFBSSxJQUFJLE9BQU8sUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsMkJBQTJCLENBQUMsQ0FBQTthQUMvQztZQUNELElBQUksT0FBTyxRQUFRLEtBQUssWUFBWSxFQUFFO2dCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxvQkFBb0IsWUFBWSxFQUFFLENBQUMsQ0FBQTthQUN0RDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLE9BQU07S0FDUDtJQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0FBQ3BDLENB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