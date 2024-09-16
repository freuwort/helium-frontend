export function useDebugMode(): boolean
{
    const domain = useDomainStore()
    const auth = useAuthStore()

    if (!domain.policy('debug_mode')) return false
    if (!auth.can('system.debugger')) return false

    return true
}