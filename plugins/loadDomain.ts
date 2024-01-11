export default defineNuxtPlugin({
    name: 'load-domain',
    dependsOn: ['load-csrf'],
    async setup()
    {
        const domain = useDomainStore()
        await domain.fetchCompanyMeta()
    }
})
