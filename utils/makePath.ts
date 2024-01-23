export default function (path: string, parameters: Object): string
{
    const queryString = new URLSearchParams(parameters).toString()

    return queryString ? `${path}?${queryString}` : path
}