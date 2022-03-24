import {MyContext} from "../types/MyContext";
import {State} from "../types/State";
import isPrivateKey from "../validation/isPrivateKey";
import activeMenu from "../menus/activeMenu";

export default (ctx: MyContext) => {
    if (ctx.session.state !== State.Importing) {
        return;
    }

    const msg = ctx.message?.text;
    if (!isPrivateKey(msg)) {
        return ctx.reply('Сообщение не распознано как приватный ключ');
    }

    ctx.session.privateKey = msg;
    ctx.session.state = State.Default;
    return ctx.reply('Ключ импортирован', {reply_markup: activeMenu})
}
