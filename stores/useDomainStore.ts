type CompanyMeta = {
    name: string
    legalName: string
    slogan: string
    logo: string
    favicon: string
}

export const useDomainStore = defineStore('domain', () => {
    const companyMeta = ref<CompanyMeta | null>({
        name: 'Unternehmen',
        legalName: 'Unternehmen GmbH',
        slogan: '',
        logo: 'https://fdbs.de/storage/media/branding/logos/logo_no_spacing.png',
        favicon: '',
    })

    return { companyMeta }
})