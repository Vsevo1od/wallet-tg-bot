import {Context} from "grammy";
import {Menu} from "@grammyjs/menu";

let activeMenu: Menu;

const exportWallet = (ctx: Context) => ctx.reply("Экспорт кошелька", {reply_markup: activeMenu});
const deposit = (ctx: Context) => ctx.reply("Пополнение кошелька", {reply_markup: activeMenu});
const send = (ctx: Context) => ctx.reply("Отправка средств", {reply_markup: activeMenu});
const getBalance = (ctx: Context) => ctx.reply("Просмотр баланса", {reply_markup: activeMenu});
const getAddress = (ctx: Context) => ctx.reply("Узнать адрес своего кошелька", {reply_markup: activeMenu});

activeMenu = new Menu("active-menu")
    .text("Импорт кошелька", exportWallet).row()
    .text("Пополнение кошелька", deposit)
    .text("Просмотр баланса", getBalance).row()
    .text("Узнать адрес своего кошелька", getAddress).row()
    .text("Отправка средств", send).row();

export default activeMenu;
