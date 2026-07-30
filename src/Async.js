export function delay(timeout, callback)
{
    if (typeof timeout !== 'number')
        timeout = 0;
    
    if (!timeout)
        callback();
    else
        return setTimeout(callback, timeout);
}

export function sleep(timeout) 
{
    return new Promise(resolve => setTimeout(resolve, timeout));
}