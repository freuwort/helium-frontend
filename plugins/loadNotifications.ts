export default defineNuxtPlugin({
    name: 'load-notifications',
    dependsOn: ['load-session'],
    async setup()
    {
        if (!useAuthStore().session.authenticated) return
        
        const notifications = useNotificationStore()
        await notifications.fetchNotifications()
    }
})
