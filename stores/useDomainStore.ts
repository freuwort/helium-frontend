type Settings = {
    [key: string]: any
}

export const useDomainStore = defineStore('domain', () => {
    const settings = ref<Settings | null>(null)

    async function fetchSettings()
    {
        try {
            settings.value = (await useAxios().get('/api/domain/settings')).data
        }
        catch (error) {
            console.log('Could not fetch domain settings!')
        }
    }

    async function patchSettings(keys: Settings|string, value: any = null)
    {
        if (typeof keys === 'string') {
            keys = {[keys]: value}
        }

        try {
            await useAxios().patch('/api/settings', keys)
        }
        catch (error) {
            console.log('Could not patch domain settings!')
        }
    }

    function policy(key: string)
    {
        if (!settings.value) return null
        if (!settings.value['policy_'+key]) return null

        return settings.value['policy_'+key]
    }

    return {
        settings: settings as unknown as Settings,
        fetchSettings,
        patchSettings,
        policy,
    }
})