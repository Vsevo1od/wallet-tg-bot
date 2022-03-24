import {Wallet} from "ethers";

export default function (str: string | undefined): str is string {
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
