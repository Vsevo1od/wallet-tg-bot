import {Context} from "grammy";
import activeMenu from "../menus/activeMenu";
import {Wallet} from 'ethers';
import {randomBytes} from "crypto";
import {MenuFlavor} from "@grammyjs/menu/out/menu";

const createWallet = (ctx: Context & MenuFlavor) => {
    const privateKey = "0x" + randomBytes(32).toString('hex');
    const wallet = new Wallet(privateKey);
    ctx.menu.close();
    return ctx.reply(`Кошелёк создан, адрес ${wallet.address}`, {reply_markup: activeMenu});
};

export default createWallet;
