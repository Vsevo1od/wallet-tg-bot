// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts

import {config} from 'dotenv';
import {Bot, Context, session} from "grammy";
import { Menu } from "@grammyjs/menu";
import activeMenu from "./menus/activeMenu";
import createWallet from "./actions/createWallet";
import {MyContext, SessionData} from "./types/MyContext";

config({path: '.env.local'});

const BOT_TOKEN = process.env.BOT_TOKEN
if (BOT_TOKEN === undefined) {
    throw new Error('BOT_TOKEN must be provided')
}

const bot = new Bot<MyContext>(BOT_TOKEN);
bot.use(session({ initial: (): SessionData => ({ privateKey: undefined }) }));
bot.use(activeMenu);

const importWallet = (ctx: Context) => ctx.reply("Кошелёк импортирован", {reply_markup: activeMenu});
const newMenu = new Menu<MyContext>("new-menu")
    .text("Создание кошелька", createWallet)
    .text("Импорт кошелька", importWallet).row()
;
bot.use(newMenu);

bot.command("start", (ctx) => {
    return ctx.reply("Добро пожаловать! Импортируйте или создайте кошелёк", {reply_markup: newMenu});
});
bot.start();
bot.api.setMyCommands([
    { command: "start", description: "Запуск бота" },
]);
