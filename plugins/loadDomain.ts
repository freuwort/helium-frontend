export default defineNuxtPlugin({
    name: 'load-domain',
    dependsOn: ['load-csrf'],
    async setup()
    {
        const domain = useDomainStore()

        try {
            await domain.fetchSettings()
        }
        catch (error) {}
    }
})
