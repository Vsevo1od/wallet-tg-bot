import {Menu} from "@grammyjs/menu";
import {MyContext} from "../types/MyContext";
import {Wallet} from "ethers";
import {assertIsPrivateKey} from "../validation/isPrivateKey";
import provider from "../modules/provider";
import {formatEther} from "ethers/lib/utils";
import {MenuFlavor} from "@grammyjs/menu/out/menu";

let activeMenu: Menu<MyContext>;

const exportWallet = async (ctx: MyContext & MenuFlavor) => {
    ctx.menu.close();
    assertIsPrivateKey(ctx.session.privateKey);
    await ctx.reply(ctx.session.privateKey);
    return ctx.reply("Экспорт кошелька", {reply_markup: activeMenu});
};
const deposit = (ctx: MyContext & MenuFlavor) => {
    ctx.menu.close();
    assertIsPrivateKey(ctx.session.privateKey);
    const wallet = new Wallet(ctx.session.privateKey)
    return ctx.reply(
        `Для пополнения кошелька воспользуйтесь https://faucets.chain.link/kovan\n Ваш кошелёк <code>${wallet.address}</code>`,
        {reply_markup: activeMenu, parse_mode: "HTML" }
    );
};
const getBalance = async (ctx: MyContext & MenuFlavor) => {
    ctx.menu.close();
    assertIsPrivateKey(ctx.session.privateKey);
    const wallet = new Wallet(ctx.session.privateKey, provider);
    const balance = formatEther(await wallet.getBalance());
    return ctx.reply(`Ваш баланс: ${balance} eth`, {reply_markup: activeMenu});
};
const getAddress = async (ctx: MyContext & MenuFlavor) => {
    ctx.menu.close();
    assertIsPrivateKey(ctx.session.privateKey);
    const wallet = new Wallet(ctx.session.privateKey);
    return ctx.reply(`Ваш адрес: ${wallet.address}`, {reply_markup: activeMenu});
};

const send = (ctx: MyContext) => ctx.reply("Отправка средств", {reply_markup: activeMenu});

activeMenu = new Menu<MyContext>("active-menu")
    .text("Экспорт кошелька", exportWallet).row()
    .text("Пополнение кошелька", deposit)
    .text("Просмотр баланса", getBalance).row()
    .text("Узнать адрес своего кошелька", getAddress).row()
    .text("Отправка средств", send).row();

export default activeMenu;
