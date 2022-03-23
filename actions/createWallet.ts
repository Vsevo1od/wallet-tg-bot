import {Context} from "grammy";
import activeMenu from "../menus/activeMenu";
import {Wallet} from 'ethers';
import {randomBytes} from "crypto";

const createWallet = (ctx: Context) => {
    const privateKey = "0x" + randomBytes(32).toString('hex');
    const wallet = new Wallet(privateKey);
    return ctx.reply(`Кошелёк создан, адрес ${wallet.address}`, {reply_markup: activeMenu});
};

export default createWallet;
