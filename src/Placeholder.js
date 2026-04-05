export function extractPlaceholders(text) 
{
    const result = new Set();

    for (const match of text.matchAll(PlaceholderSet.REGEX))
        result.add(match[1]);

    return [...result];
}

export class PlaceholderSet
{
    static REGEX = /{{\s*([^{}|]+?)\s*(?:\|\s*([^}]+))?\s*}}/g; // /{{\s*([a-zA-Z0-9_-]+)\s*(?:\|\s*([^}]+))?\s*}}/g; // /{{\s*([a-zA-Z0-9_.-]+)\s*}}/g;

    list = new Set();

    add (value)
    {
        if (typeof value === 'string')
        {
            this.list.add(value);
            return this;
        }

        for (const item of value)
            this.list.add(item);

        return this;
    }

    parse(text)
    {
        for (const match of text.matchAll(PlaceholderSet.REGEX))
            this.list.add(match[1]);

        return this;
    }

    get()
    {
        return [...this.list];
    }

    clear()
    {
        this.list = new Set();
        return this;
    }
}