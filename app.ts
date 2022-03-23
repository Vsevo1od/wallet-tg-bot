// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts

import {config} from 'dotenv';
import {Bot, Context} from "grammy";
import { Menu } from "@grammyjs/menu";

config({path: '.env.local'});

const BOT_TOKEN = process.env.BOT_TOKEN

if (BOT_TOKEN === undefined) {
    throw new Error('BOT_TOKEN must be provided')
}

const bot = new Bot(BOT_TOKEN);
let activeMenu: Menu;

const importWallet = (ctx: Context) => ctx.reply("Импорт кошелька", {reply_markup: activeMenu});
const deposit = (ctx: Context) => ctx.reply("Пополнение кошелька", {reply_markup: activeMenu});
const send = (ctx: Context) => ctx.reply("Отправка средств", {reply_markup: activeMenu});
const getBalance = (ctx: Context) => ctx.reply("Просмотр баланса", {reply_markup: activeMenu});
const getAddress = (ctx: Context) => ctx.reply("Узнать адрес своего кошелька", {reply_markup: activeMenu});

activeMenu = new Menu("active-menu")
    .text("Импорт кошелька", importWallet).row()
    .text("Пополнение кошелька", deposit)
    .text("Просмотр баланса", getBalance).row()
    .text("Узнать адрес своего кошелька", getAddress).row()
    .text("Отправка средств", send).row();
bot.use(activeMenu);

const createWallet = (ctx: Context) => ctx.reply("Кошелёк создан", {reply_markup: activeMenu});
const exportWallet = (ctx: Context) => ctx.reply("Кошелёк экспортирован", {reply_markup: activeMenu});
const newMenu = new Menu("new-menu")
    .text("Создание кошелька", createWallet)
    .text("Экспорт кошелька", exportWallet).row()
;
bot.use(newMenu);

bot.command("start", (ctx) => {
    return ctx.reply("Welcome! Up and running.", {reply_markup: newMenu});
});
bot.start();

