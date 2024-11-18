export default function (pathOrUrl: string|null): boolean {
    if (!pathOrUrl) return false
    return pathOrUrl.startsWith('/') || pathOrUrl.startsWith('http')
}