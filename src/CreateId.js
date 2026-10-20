let prevId = 0;

export function createId()
{
    let newId = (new Date).getTime();

    if (newId <= prevId)
        newId = prevId + 1;

    prevId = newId;
    return newId.toString();
}