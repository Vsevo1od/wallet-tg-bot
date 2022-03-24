import {MyContext} from "../types/MyContext";
import {State} from "../types/State";

export default (ctx: MyContext) => {
    ctx.session.state = State.Importing;
    return ctx.reply("Пожалуйста, отправьте приватный ключ в ответном сообщении");
};
