import { FunctionHook } from "./function-hook.interface";
export interface HookCollection {
    [functionName: string]: FunctionHook;
}
