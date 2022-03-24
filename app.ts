// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts

import {config} from 'dotenv';
import {Bot, session} from "grammy";
import activeMenu from "./menus/activeMenu";
import {MyContext, SessionData} from "./types/MyContext";
import newMenu from './menus/newMenu';
import {State} from "./types/State";
import onImportPrivateKey from "./subscribers/onImportPrivateKey";

config({path: '.env.local'});

const BOT_TOKEN = process.env.BOT_TOKEN
if (BOT_TOKEN === undefined) {
    throw new Error('BOT_TOKEN must be provided')
}

const bot = new Bot<MyContext>(BOT_TOKEN);
bot.use(session({ initial: (): SessionData => ({ state: State.Default }) }));
bot.use(activeMenu);
bot.use(newMenu);

bot.command("start", (ctx) => {
    return ctx.reply("Добро пожаловать! Импортируйте или создайте кошелёк", {reply_markup: newMenu});
});
bot.on('message:text', onImportPrivateKey);

bot.start();
bot.api.setMyCommands([
    { command: "start", description: "Запуск бота" },
]);
