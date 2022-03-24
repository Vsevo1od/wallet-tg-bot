import activeMenu from "../menus/activeMenu";
import {Wallet} from 'ethers';
import {randomBytes} from "crypto";
import {MenuFlavor} from "@grammyjs/menu/out/menu";
import {MyContext} from "../types/MyContext";

const createWallet = (ctx: MyContext & MenuFlavor) => {
    ctx.session.privateKey = "0x" + randomBytes(32).toString('hex');
    const wallet = new Wallet(ctx.session.privateKey);
    ctx.menu.close();
    return ctx.reply(`Кошелёк создан, адрес ${wallet.address}`, {reply_markup: activeMenu});
};

export default createWallet;
