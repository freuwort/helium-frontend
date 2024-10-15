export default defineNuxtPlugin({
    name: 'load-notifications',
    dependsOn: ['load-session'],
    async setup()
    {
        const notifications = useNotificationStore()
        await notifications.fetchNotifications()
    }
})
