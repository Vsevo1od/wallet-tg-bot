// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts
import {config} from 'dotenv';
import {Bot, GrammyError, HttpError, session} from "grammy";
import activeMenu from "./menus/activeMenu";
import {MyContext, SessionData} from "./types/MyContext";
import newMenu from './menus/newMenu';
import {State} from "./types/State";
import onImportPrivateKey from "./subscribers/onImportPrivateKey";
import {onSendToAddress, onSendAmount} from "./subscribers/onSendAction";

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
bot.on('message:text', (async ctx => {
    await onSendAmount(ctx);
    await onSendToAddress(ctx);
    await onImportPrivateKey(ctx);
}));

bot.api.setMyCommands([
    { command: "start", description: "Запуск бота" },
]);

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});

export default bot;
