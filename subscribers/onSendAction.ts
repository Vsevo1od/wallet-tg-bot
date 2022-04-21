import {MyContext} from "../types/MyContext";
import {State} from "../types/State";
import {assertIsPrivateKey} from "../validation/isPrivateKey";
import {isAddress} from "ethers/lib/utils";
import {Wallet} from "ethers";
import provider from "../modules/provider";
import activeMenu from "../menus/activeMenu";

export async function onSendToAddress(ctx: MyContext) {
    if (ctx.session.state !== State.SendToAddress) {
        return;
    }
    const msg = ctx.message?.text;
    if (!isAddress(msg || '')) {
        return ctx.reply('Сообщение не распознано как адрес');
    }
    ctx.session.sendToAddress = msg as string;
    ctx.session.state = State.SendAmount;
    return ctx.reply('Сколько отправляем wei');
}

export async function onSendAmount(ctx: MyContext) {
    if (ctx.session.state !== State.SendAmount) {
        return;
    }
    const msg = ctx.message?.text;

    if (typeof msg !== 'string' || !Number.isInteger(parseInt(msg))) {
        return ctx.reply('Сообщение не распознано как число');
    }
    const wei = parseInt(msg);

    assertIsPrivateKey(ctx.session.privateKey);
    const wallet = new Wallet(ctx.session.privateKey, provider);
    await ctx.reply('Отправляем...');
    const txResponse = await wallet.sendTransaction({
        to: ctx.session.sendToAddress,
        value: wei,
    });
    await ctx.reply(`Ссылка на транзакцию https://kovan.etherscan.io/tx/${txResponse.hash}`)
    return ctx.reply('Транзакция выполнена', {reply_markup: activeMenu});
}
