export default defineNuxtPlugin({
    name: 'load-session',
    dependsOn: ['load-csrf'],
    async setup()
    {
        const auth = useAuthStore()
        await auth.fetchSession()
    }
})
