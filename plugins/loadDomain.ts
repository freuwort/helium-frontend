export default defineNuxtPlugin(async (nuxtApp) => {
    const domain = useDomainStore()
    
    await domain.fetchCompanyMeta()
})
