import {Context, SessionFlavor} from "grammy";
import { State } from "./State";

export interface SessionData {
    privateKey?: string;
    state: State;
}
export type MyContext = Context & SessionFlavor<SessionData>;
