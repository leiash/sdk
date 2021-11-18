import { hook } from "../../index";

/**
 * Makes a method callable by other modules
 */
export const Callable = (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    // registerCallable(target.constructor.name, propertyKey);
}

/**
 * Hook into the call of another function
 */
export const Hook = (hookName: string) => {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        hook(hookName, target[propertyKey], target);
    };
}