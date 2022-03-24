import {Wallet} from "ethers";

function isPrivateKey(str: string | undefined): str is string {
    if (typeof str !== 'string'){
        return false;
    }
    try {
        new Wallet(str); // will throw if not a private key
        return true;
    } catch {
        return false;
    }
}

export default isPrivateKey;

export function assertIsPrivateKey(str: string | undefined): asserts str is string {
    if (!isPrivateKey(str)){
        throw new Error('Not a private key');
    }
}
