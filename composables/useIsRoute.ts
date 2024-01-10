export function useIsRoute(route: string)
{
    return route === useRoute().name
}