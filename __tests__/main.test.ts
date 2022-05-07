// See https://github.com/PavelPolyakov/grammy-with-tests/blob/master/__tests__/bot.test.js
import bot from "../bot";
import {Methods, Payload, RawApi} from "grammy/out/core/client";
import {InlineKeyboardButton, Update} from "grammy/out/platform.node";

const TEST_PRIVATE_KEY = '0xcb45a73faa747644a75b69f9a2941eb246f21cf3517d8aad1839afa69d330ca6';
const TEST_WALLET_ADDRESS = '0xdD549BeB5dedED9720389F8F99c2ef28514b4739';

type OutgoingRequest = {
    method: Methods<RawApi>,
    payload:  Payload<Methods<RawApi>, RawApi>
        & {text?: string}
        & {reply_markup?: {
            "inline_keyboard": InlineKeyboardButton.CallbackButton[][]
        }},
    signal:  AbortSignal | undefined,
}

let outgoingRequests: OutgoingRequest[] = [];

function generateMessage(message: string): Update {
    return {
            "update_id": 501315910,
            "message": {
                "message_id": 479,
                "from": {
                    "id": 135081555,
                    "is_bot": false,
                    "first_name": "Vsevolod",
                    "last_name": "X",
                    "username": "hidden",
                    "language_code": "en"
                },
                "chat": {
                    "id": 135081555,
                    "first_name": "Vsevolod",
                    "last_name": "X",
                    "username": "hidden",
                    "type": "private"
                },
                "date": 1650785787,
                "text": message,
                "entities": [
                    {
                        "offset": 0,
                        "length": 6,
                        "type": "bot_command"
                    }
                ]
            }
    }
}

function generateMessageWithCallback(data: string): Update {
 return {
     "update_id": 501315932,
     "callback_query": {
         "id": "580170862734300445",
         "from": {
             "id": 135081555,
             "is_bot": false,
             "first_name": "Vsevolod",
             "last_name": "X",
             "username": "hidden",
             "language_code": "en"
         },
         "message": {
             "message_id": 507,
             "from": {
                 "id": 5241775297,
                 "is_bot": true,
                 "first_name": "WalletTgBot",
                 "username": "WalletTgBot"
             },
             "chat": {
                 "id": 135081555,
                 "first_name": "Vsevolod",
                 "last_name": "X",
                 "username": "hidden",
                 "type": "private"
             },
             "date": 1651906839,
             "text": "Добро пожаловать! Импортируйте или создайте кошелёк",
             "reply_markup": {
                 "inline_keyboard": [
                     [
                         {
                             "text": "Создание кошелька",
                             "callback_data": "new-menu/0/0//h�0��"
                         },
                         {
                             "text": "Импорт кошелька",
                             "callback_data": "new-menu/0/1//h�\u001f�r"
                         }
                     ]
                 ]
             }
         },
         "chat_instance": "-5524653669258245566",
         data
     }
 }
}

function getCallbackData(callbackDataText: string, request?: OutgoingRequest): string {
    const data = request
        ?.payload
        ?.reply_markup
        ?.inline_keyboard[0]
        .find(({text}) => text === callbackDataText)
        ?.callback_data as string
    ;
    expect(typeof data).toBe('string');
    return data;
}

beforeAll(async () => {
    bot.api.config.use((prev, method, payload: any, signal) => {
        outgoingRequests.push({ method, payload, signal });
        return { ok: true, result: true } as any;
    });

    bot.botInfo = {
        id: 42,
        first_name: "Test Bot",
        is_bot: true,
        username: "bot",
        can_join_groups: true,
        can_read_all_group_messages: true,
        supports_inline_queries: false,
    };
    await bot.init();
});

beforeEach(() => {
    outgoingRequests = [];
});

test("start", async () => {
    await bot.handleUpdate(generateMessage("/start"));
    expect(outgoingRequests.length).toBe(1);
    expect(outgoingRequests.pop()?.payload.text).toBe('Добро пожаловать! Импортируйте или создайте кошелёк');
});

test("create wallet", async () => {
    await bot.handleUpdate(generateMessage("/start"));
    const createCommandCallbackData = getCallbackData('Создание кошелька', outgoingRequests[0]);
    await bot.handleUpdate(generateMessageWithCallback(createCommandCallbackData));
    expect(outgoingRequests.length).toBe(4);
    expect(outgoingRequests[2]?.payload.text).toMatch(/Кошелёк создан, адрес 0x[A-Za-z0-9]{40}/);
});

test("import", async () => {
    await bot.handleUpdate(generateMessage("/start"));

    const importCommandCallbackData = getCallbackData('Импорт кошелька', outgoingRequests[0]);
    await bot.handleUpdate(generateMessageWithCallback(importCommandCallbackData));
    expect(outgoingRequests.length).toBe(3);
    expect(outgoingRequests[1]?.payload.text).toBe('Пожалуйста, отправьте приватный ключ в ответном сообщении');

    await bot.handleUpdate(generateMessage(TEST_PRIVATE_KEY));
    expect(outgoingRequests.length).toBe(4);
    expect(outgoingRequests[3]?.payload.text).toBe('Ключ импортирован');
});

test("export", async () => {
    await bot.handleUpdate(generateMessage("/start"));

    const importCommandCallbackData = getCallbackData('Импорт кошелька', outgoingRequests[0]);
    await bot.handleUpdate(generateMessageWithCallback(importCommandCallbackData));

    await bot.handleUpdate(generateMessage(TEST_PRIVATE_KEY));

    const exportCommandCallbackData = getCallbackData('Экспорт кошелька', outgoingRequests[3]);
    await bot.handleUpdate(generateMessageWithCallback(exportCommandCallbackData));

    expect(outgoingRequests.length).toBe(8);
    expect(outgoingRequests[4]?.payload.text).toBe(TEST_PRIVATE_KEY);
    expect(outgoingRequests[6]?.payload.text).toBe('Экспорт кошелька');
});
