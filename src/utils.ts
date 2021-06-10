export function cleanObject<T>(object: T): T {
    for (const propName in object) {
        if (object[propName] === null || object[propName] === undefined) {
            delete object[propName];
        }
    }
    return object
}