export class EventEmitter
{
    callbacks = [];

    // SUB

    on(callback) 
    {
        this.callbacks.push(callback);
    }

    add(callback) 
    {
        this.callbacks.push(callback);
    }

    // UNSUB

    off(callback) 
    {
        this.callbacks = this.callbacks.filter(fn => fn !== callback);
    }

    del(callback) 
    {
        this.callbacks = this.callbacks.filter(fn => fn !== callback);
    }

    // TRIGGER

    emit(...args)
    {
        const callbacks = [...this.callbacks];

        for (const callback of callbacks)
            callback(...args);
    }

    trigger(...args)
    {
        this.emit(...args);
    }
} 

 