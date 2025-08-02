export function useDevMode(): boolean
{
    const domain = useDomainStore()
    const auth = useAuthStore()

    if (!domain.policy('developer_mode')) return false
    if (!auth.can('system.developer')) return false

    return true
}