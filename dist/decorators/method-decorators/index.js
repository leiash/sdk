"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = exports.Callable = void 0;
const index_1 = require("../../index");
const Callable = (target, propertyKey, descriptor) => {
};
exports.Callable = Callable;
const Hook = (hookName) => {
    return function (target, propertyKey, descriptor) {
        index_1.hook(hookName, target[propertyKey], target);
    };
};
exports.Hook = Hook;
//# sourceMappingURL=index.js.map