import { HookCollection } from "src/interfaces/hook-collection.interface";

export const HANDLED = 0;
export const CONTINUE = 1;
const registeredHooks: { hookName: string, hook: Function, context: object }[] = [];

export function hook(hookName: string, hook: Function, context: object) {
    registeredHooks.push({ hookName, hook, context });
}

export function registerHooks(object: any, hookCollection: HookCollection) {
    Object.keys(hookCollection).forEach(functionName => {
        const functionHook = hookCollection[functionName];
        register(object, functionName, { postHookName: functionHook.postHook, preHookName: functionHook.preHook });

    })
}

export function register(object: any, functionName: any, hooks?: { postHookName?: string, preHookName?: string }) {
    (function (originalFunction) {
        let temp = object[functionName]
        object[functionName] = function (...args: any) {
            const finishHook = () => {
                let ret = temp.apply(this, args)
                if (ret && typeof ret.then === 'function') {
                    return ret.then((value: any) => {
                        if (hooks?.postHookName)
                            callPostHook(hooks.postHookName, this, ret);
                        return value;
                    })
                } else {
                    if (hooks?.postHookName)
                        callPostHook(hooks.postHookName, this, ret);
                    return ret
                }
            }

            if (hooks?.preHookName) {
                callPreHook(hooks.preHookName, this, args).then((keepGoing: any) => {
                    // Check if Handled is returned
                    if (keepGoing === HANDLED) return;
                    else finishHook()
                });
            } else {
                finishHook();
            }

        }
    }(object[functionName]));
}

async function callPreHook(hookName: string, object: any, args: any) {
    let returnedValue = undefined;
    for (let i = 0; i < registeredHooks.length; i++) {
        const hook = registeredHooks[i];
        if (hook.hookName === hookName) {
            console.log("[Leia] Calling prehook: " + hookName);
            if (typeof hook.context[hook.hook.name] === "function")
                returnedValue = await hook.context[hook.hook.name](...args);
            else if (typeof hook.hook === "function")
                returnedValue = await hook.hook(...args);
            else console.log("[Leia] Hook does not have a function")
        }
    }
    return returnedValue;
}

function callPostHook(hookName: string, object: any, args: any) {
    for (let i = 0; i < registeredHooks.length; i++) {
        const hook = registeredHooks[i];
        if (hook.hookName === hookName) {
            console.log("[Leia] Calling posthook: " + hookName);
            hook.context[hook.hook.name](Array.isArray(args) ? args : [args]);
            // hook.hook.apply(object, Array.isArray(args) ? args : [args]);
            break;
        }
    }
}