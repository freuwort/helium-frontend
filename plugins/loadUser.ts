export default defineNuxtPlugin({
    name: 'load-user',
    dependsOn: ['load-csrf'],
    async setup()
    {
        const auth = useAuthStore()
        if (!auth.isLoggedIn) await auth.fetchUser()
    }
})
