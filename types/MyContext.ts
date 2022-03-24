import {Context, SessionFlavor} from "grammy";

export interface SessionData {privateKey?: string}
export type MyContext = Context & SessionFlavor<SessionData>;
