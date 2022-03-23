// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts

import { Telegraf } from 'telegraf';
import {config} from 'dotenv';

config({path: '.env.local'});

const BOT_TOKEN = process.env.BOT_TOKEN

if (BOT_TOKEN === undefined) {
    throw new Error('BOT_TOKEN must be provided')
}

const bot = new Telegraf(BOT_TOKEN)
// Set the bot response
bot.on('text', (ctx) => ctx.replyWithHTML('<b>Hello</b>'))
bot.launch()
