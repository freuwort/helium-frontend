export function useIntended(): string
{
    const route = useRoute()
    return route.query?.intended ? `?intended=${route.query.intended}` : ''
}