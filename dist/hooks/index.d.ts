import { HookCollection } from "src/interfaces/hook-collection.interface";
export declare const HANDLED = 0;
export declare const CONTINUE = 1;
export declare function hook(hookName: string, hook: Function, context: object): void;
export declare function registerHooks(object: any, hookCollection: HookCollection): void;
export declare function register(object: any, functionName: any, hooks?: {
    postHookName?: string;
    preHookName?: string;
}): void;
