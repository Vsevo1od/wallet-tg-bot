// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts

import {config} from 'dotenv';
import { Bot } from "grammy";

config({path: '.env.local'});

const BOT_TOKEN = process.env.BOT_TOKEN

if (BOT_TOKEN === undefined) {
    throw new Error('BOT_TOKEN must be provided')
}

const bot = new Bot(BOT_TOKEN);
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", async (ctx) => {
    await bot.api.setMyCommands([
        { command: "create", description: "Создание кошелька" },
        { command: "export", description: "Экспорт кошелька" },
        { command: "import", description: "Импорт кошелька" },
        { command: "deposit", description: "Пополнение кошелька" },
        { command: "balance", description: "Просмотр баланса" },
        { command: "send", description: "Отправка средств" },
        { command: "address", description: "Узнать адрес своего кошелька" },
    ]);
    return ctx.reply("Got another message!");
});
bot.start();

