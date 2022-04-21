import {Context, SessionFlavor} from "grammy";
import { State } from "./State";

export interface SessionData {
    privateKey?: string;
    state: State;
    sendToAddress?: string;
}
export type MyContext = Context & SessionFlavor<SessionData>;
