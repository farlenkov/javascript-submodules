export function delay(timeout, callback)
{
    if (typeof timeout !== 'number' || !timeout || timeout <= 0)
        callback();
    else
        return setTimeout(callback, timeout);
}

export function sleep(timeout) 
{
    if (typeof timeout !== 'number' || !timeout || timeout <= 0)
        return Promise.resolve();
    else
        return new Promise(resolve => setTimeout(resolve, timeout));
}