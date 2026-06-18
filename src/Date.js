export function unixToStr(unixTime, format = 'YYYY-MM-DD HH:mm')
{
    if (typeof unixTime === 'string')
        unixTime = Number.parseInt(unixTime);

    return moment(unixTime).format(format);
}