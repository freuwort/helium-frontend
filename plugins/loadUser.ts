export default defineNuxtPlugin({
    name: 'load-user',
    dependsOn: ['load-csrf'],
    async setup()
    {
        const auth = useAuthStore()
        await auth.fetchSession()
    }
})
