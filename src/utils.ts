export function range(n: number) {
    return [...Array(n).keys()]
}


export function copy<T>(item: T) {
    return JSON.parse(JSON.stringify(item)) as T;
}
