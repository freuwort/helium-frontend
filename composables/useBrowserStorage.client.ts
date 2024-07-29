export function useBrowserStorage(type: 'session'|'local' = 'local')
{
    let storage: any = null

    if (process.client)
    {
        storage = type === 'local' ? localStorage : sessionStorage
    }
    
    return {
        get(key: string, defaultValue: any = null): any
        {
            if (!storage) return defaultValue ?? null
            
            return JSON.parse(storage?.getItem(key) as string) ?? defaultValue ?? null
        },

        set(key: string, value: any): void
        {
            if (!storage) return
            
            storage?.setItem(key, JSON.stringify(value))
        },

        reset(key: string): void
        {
            if (!storage) return
            
            storage?.removeItem(key)
        },
    }
}