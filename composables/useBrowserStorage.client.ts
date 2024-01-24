export function useBrowserStorage(type: 'local' | 'session' = 'local')
{
    let storage: any = null

    if (process.client)
    {
        storage = type === 'local' ? localStorage : sessionStorage
    }
    
    return {
        get(scope: string, key: string, defaultValue: any = null): any
        {
            if (!storage) return defaultValue ?? null
            
            return JSON.parse(storage?.getItem(scope+':'+key) as string) ?? defaultValue ?? null
        },

        set(scope: string, key: string, value: any): void
        {
            if (!storage) return
            
            storage?.setItem(scope+':'+key, JSON.stringify(value))
        },

        reset(scope: string, key: string): void
        {
            if (!storage) return
            
            storage?.removeItem(scope+':'+key)
        },
    }
}