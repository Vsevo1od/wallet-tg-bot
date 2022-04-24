// See https://github.com/PavelPolyakov/grammy-with-tests/blob/master/__tests__/bot.test.js
import bot from "../bot";
import {Methods, Payload, RawApi} from "grammy/out/core/client";
import {Update} from "grammy/out/platform.node";

let outgoingRequests: {
    method: Methods<RawApi>,
    payload:  Payload<Methods<RawApi>, RawApi> & {text?: string},
    signal:  AbortSignal | undefined,
}[] = [];

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

beforeAll(async () => {
    bot.api.config.use((prev, method, payload, signal) => {
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

