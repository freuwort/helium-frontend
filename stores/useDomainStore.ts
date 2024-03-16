type Settings = {
    company_name: string
    company_legalname: string
    company_slogan: string
    company_logo: string
    company_favicon: string
    default_currency?: string
    default_unit_length?: string
    default_unit_weight?: string
    default_unit_volume?: string
    default_unit_temperature?: string
    default_unit_speed?: string
}

export const useDomainStore = defineStore('domain', () => {
    const settings = ref<Settings | null>(null)

    async function fetchSettings()
    {
        const { data } = await useApiFetch('/api/domain/settings')

        settings.value = data.value as Settings
    }

    return {
        settings: settings as unknown as Settings,
        fetchSettings,
    }
})