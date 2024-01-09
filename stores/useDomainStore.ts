type CompanyMeta = {
    name: string
    legalName: string
    slogan: string
    logo: string
    favicon: string
}

export const useDomainStore = defineStore('domain', () => {
    const companyMeta = ref<CompanyMeta | null>(null)

    async function fetchCompanyMeta()
    {
        const { data } = await useApiFetch('/api/domain/company-meta')

        companyMeta.value = data.value as CompanyMeta
    }

    return { companyMeta, fetchCompanyMeta }
})