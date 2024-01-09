export function useCompareRoutes(route: string, comparedRoute: string|null = null)
{
    if (comparedRoute === null) comparedRoute = useRoute().path as string

    if (route === comparedRoute) return 'exact'

    if (comparedRoute.startsWith(route)) return 'starts'

    if (comparedRoute.endsWith(route)) return 'ends'

    if (comparedRoute.includes(route)) return 'includes'

    return 'none'
}