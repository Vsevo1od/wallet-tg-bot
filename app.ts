// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts

import {config} from 'dotenv';
import {Bot} from "grammy";
import { Menu } from "@grammyjs/menu";

config({path: '.env.local'});

const BOT_TOKEN = process.env.BOT_TOKEN

if (BOT_TOKEN === undefined) {
    throw new Error('BOT_TOKEN must be provided')
}

const bot = new Bot(BOT_TOKEN);
const menu = new Menu("full-menu")
    .text("Создание кошелька").text("Экспорт кошелька").row()
    .text("Импорт кошелька").row()
    .text("Пополнение кошелька").text("Отправка средств").row()
    .text("Просмотр баланса").row()
    .text("Узнать адрес своего кошелька")
;
bot.use(menu);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", async (ctx) => {
    return ctx.reply("Got another message!", {reply_markup: menu});
});
bot.start();

