import {Menu} from "@grammyjs/menu";
import {MyContext} from "../types/MyContext";
import {Wallet} from "ethers";
import {assertIsPrivateKey} from "../validation/isPrivateKey";

let activeMenu: Menu<MyContext>;

const exportWallet = async (ctx: MyContext) => {
    assertIsPrivateKey(ctx.session.privateKey);
    await ctx.reply(ctx.session.privateKey);
    return ctx.reply("Экспорт кошелька", {reply_markup: activeMenu});
};
const deposit = (ctx: MyContext) => {
    assertIsPrivateKey(ctx.session.privateKey);
    const wallet = new Wallet(ctx.session.privateKey)
    return ctx.reply(
        `Для пополнения кошелька воспользуйтесь https://faucets.chain.link/kovan\n Ваш кошелёк <code>${wallet.address}</code>`,
        {reply_markup: activeMenu, parse_mode: "HTML" }
    );
};
const send = (ctx: MyContext) => ctx.reply("Отправка средств", {reply_markup: activeMenu});
const getBalance = (ctx: MyContext) => ctx.reply("Просмотр баланса", {reply_markup: activeMenu});
const getAddress = (ctx: MyContext) => ctx.reply("Узнать адрес своего кошелька", {reply_markup: activeMenu});

activeMenu = new Menu<MyContext>("active-menu")
    .text("Экспорт кошелька", exportWallet).row()
    .text("Пополнение кошелька", deposit)
    .text("Просмотр баланса", getBalance).row()
    .text("Узнать адрес своего кошелька", getAddress).row()
    .text("Отправка средств", send).row();

export default activeMenu;
