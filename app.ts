// Based on https://github.com/telegraf/telegraf/blob/v4/docs/examples/express-webhook-bot.ts

// @ts-expect-error
import express, { Request, Response } from 'express'
import { Telegraf } from 'telegraf'

const BOT_TOKEN = process.env.BOT_TOKEN
if (BOT_TOKEN === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const BOT_DOMAIN = process.env.BOT_DOMAIN
if (BOT_DOMAIN === undefined) {
    throw new Error('BOT_DOMAIN must be provided!')
}

const bot = new Telegraf(BOT_TOKEN)
// Set the bot response
bot.on('text', (ctx) => ctx.replyWithHTML('<b>Hello</b>'))

const secretPath = `/telegraf/${bot.secretPathComponent()}`

// Set telegram webhook
bot.telegram.setWebhook(`${BOT_DOMAIN}${secretPath}`)

const app = express()
app.get('/', (req: Request, res: Response) => res.send('Hello World!'))
// Set the bot API endpoint
app.use(bot.webhookCallback(secretPath))
app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
})

// No need to call bot.launch()
