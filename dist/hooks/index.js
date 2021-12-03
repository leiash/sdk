"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.registerHooks = exports.hook = exports.CONTINUE = exports.HANDLED = void 0;
exports.HANDLED = 0;
exports.CONTINUE = 1;
const registeredHooks = [];
function hook(hookName, hook, context) {
    registeredHooks.push({ hookName, hook, context });
}
exports.hook = hook;
function registerHooks(object, hookCollection) {
    Object.keys(hookCollection).forEach(functionName => {
        const functionHook = hookCollection[functionName];
        register(object, functionName, { postHookName: functionHook.postHook, preHookName: functionHook.preHook });
    });
}
exports.registerHooks = registerHooks;
function register(object, functionName, hooks) {
    (function (originalFunction) {
        let temp = object[functionName];
        object[functionName] = function (...args) {
            const finishHook = () => {
                let ret = temp.apply(this, args);
                if (ret && typeof ret.then === 'function') {
                    return ret.then((value) => {
                        if (hooks === null || hooks === void 0 ? void 0 : hooks.postHookName)
                            callPostHook(hooks.postHookName, this, ret);
                        return value;
                    });
                }
                else {
                    if (hooks === null || hooks === void 0 ? void 0 : hooks.postHookName)
                        callPostHook(hooks.postHookName, this, ret);
                    return ret;
                }
            };
            if (hooks === null || hooks === void 0 ? void 0 : hooks.preHookName) {
                callPreHook(hooks.preHookName, this, args).then((keepGoing) => {
                    if (keepGoing === exports.HANDLED)
                        return;
                    else
                        finishHook();
                });
            }
            else {
                finishHook();
            }
        };
    }(object[functionName]));
}
exports.register = register;
async function callPreHook(hookName, object, args) {
    let returnedValue = undefined;
    for (let i = 0; i < registeredHooks.length; i++) {
        const hook = registeredHooks[i];
        if (hook.hookName === hookName) {
            console.log("[Leia] Calling prehook: " + hookName);
            if (typeof hook.context[hook.hook.name] === "function")
                returnedValue = await hook.context[hook.hook.name](...args);
            else if (typeof hook.hook === "function")
                returnedValue = await hook.hook(...args);
            else
                console.log("[Leia] Hook does not have a function");
        }
    }
    return returnedValue;
}
function callPostHook(hookName, object, args) {
    for (let i = 0; i < registeredHooks.length; i++) {
        const hook = registeredHooks[i];
        if (hook.hookName === hookName) {
            console.log("[Leia] Calling posthook: " + hookName);
            hook.context[hook.hook.name](Array.isArray(args) ? args : [args]);
            break;
        }
    }
}
//# sourceMappingURL=index.js.map