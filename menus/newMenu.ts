import {Menu} from "@grammyjs/menu";
import {MyContext} from "../types/MyContext";
import {MenuFlavor} from "@grammyjs/menu/out/menu";
import {randomBytes} from "crypto";
import {Wallet} from "ethers";
import activeMenu from "./activeMenu";
import {State} from "../types/State";

const createWallet = (ctx: MyContext & MenuFlavor) => {
    ctx.session.privateKey = "0x" + randomBytes(32).toString('hex');
    const wallet = new Wallet(ctx.session.privateKey);
    ctx.menu.close();
    return ctx.reply(`Кошелёк создан, адрес ${wallet.address}`, {reply_markup: activeMenu});
};

const importWallet = (ctx: MyContext) => {
    ctx.session.state = State.Importing;
    return ctx.reply("Пожалуйста, отправьте приватный ключ в ответном сообщении");
}

export default new Menu<MyContext>("new-menu")
    .text("Создание кошелька", createWallet)
    .text("Импорт кошелька", importWallet).row()
;
