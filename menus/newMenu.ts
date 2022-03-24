import {Menu} from "@grammyjs/menu";
import {MyContext} from "../types/MyContext";
import createWallet from "../actions/createWallet";
import importWallet from "../actions/importWallet";

export default new Menu<MyContext>("new-menu")
    .text("Создание кошелька", createWallet)
    .text("Импорт кошелька", importWallet).row()
;
