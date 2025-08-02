export default function (route: string, base: string = ''): boolean {
    const runtimeConfig = useRuntimeConfig() ?? {}

    base = base || runtimeConfig?.public?.frontendUrl || 'http://localhost:3000'
    
    try {
        const url = new URL(route, base)
        return url.origin !== new URL(base).origin
    }
    catch {
        return false
    }
}