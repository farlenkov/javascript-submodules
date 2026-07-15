export function truncateByLength(str, max, end = '...')
{
    if (!str)
        return;

    return str.length > max 
        ? str.slice(0, max - end.length) + end 
        : str;
}

export function truncateByLines(str, max, end = '...')
{
    if (!str)
        return;

    const lines = str.split(/\r?\n|\r/);

    return lines
        .slice(0, max)
        .join('\n') +
        (lines.length > max ? '\n' + end : '');
}

export function compareStrings(a, b)
{
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

export function escapeXmlAttr(value) 
{
    if (!value)
        return value;
    
    return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export function isFilePath(path) 
{
    if (!path)
        return false;

    const segments = path.split('/');
    const lastName = segments[segments.length - 1];
    return /^[^.]+\.[^.]+$/.test(lastName);
}

export function isFolderPath(path)
{
    if (!path)
        return false;

    return !isFilePath(path);
}

export function extractTag(text, tag)
{
    const regExp = new RegExp(`<${tag}>([\\s\\S]*?)(?:<\\/${tag}>|$)`);
    const match = text.match(regExp);
    return match?.[1].trim() ?? null;
}