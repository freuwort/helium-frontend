export default function (route: string): boolean {
    if (!route) {
        return false
    }
  
    try {
        const url = new URL(route, 'http://example.com')

        if (route.startsWith('/')) return true
        if (url.protocol === 'http:') return true
        if (url.protocol === 'https:') return true

        return false
    }
    catch {
        return false
    }
}