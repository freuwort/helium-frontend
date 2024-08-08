type Settings = {
    company_name: string
    company_legalname: string
    company_slogan: string
    company_logo: string
    company_favicon: string
    legal_notice?: string
    legal_privacy?: string
    default_currency?: string
    default_unit_length?: string
    default_unit_weight?: string
    default_unit_volume?: string
    default_unit_temperature?: string
    default_unit_speed?: string
    policy_allow_registration?: boolean
    policy_allow_password_reset?: boolean
    policy_allow_password_change?: boolean
    policy_allow_email_change?: boolean
    policy_allow_username_change?: boolean
    policy_allow_avatar_upload?: boolean
    policy_allow_banner_upload?: boolean
    policy_require_tfa?: boolean
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