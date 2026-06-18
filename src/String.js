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