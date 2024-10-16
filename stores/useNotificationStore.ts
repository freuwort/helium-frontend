import type { Notification } from '~/types/notification'

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref<Notification[]>([])
    const all = computed(() => notifications.value)
    const unread = computed(() => notifications.value.filter((n: Notification) => !n.read_at))
    const read = computed(() => notifications.value.filter((n: Notification) => n.read_at))

    async function fetchNotifications()
    {
        try {
            notifications.value = (await useAxios().get('/api/notifications')).data
        }
        catch (error) {
            console.log('Could not fetch notifications!')
        }
    }

    async function markAs(items: Notification|Notification[], action: 'read'|'unread' = 'read')
    {
        if (!Array.isArray(items)) items = [items]

        let readAt = action === 'read' ? new Date().toISOString() : null
        let itemIds = items.map((n: Notification) => n.id)
        
        for (const notification of notifications.value)
        {
            if (itemIds.includes(notification.id)) notification.read_at = readAt
        }

        try {
            await useAxios().patch(`/api/notifications/${action}`, { items: items.map((n: Notification) => n.id) })
        }
        catch (error) {
            console.log('Could not mark notifications as read!')
        }
    }

    async function markAsRead(items: Notification|Notification[]) { await markAs(items, 'read') }
    async function markAsUnread(items: Notification|Notification[]) { await markAs(items, 'unread') }
    async function markAllAsRead() { await markAs(notifications.value, 'read') }
    async function markAllAsUnread() { await markAs(notifications.value, 'unread') }

    return {
        notifications: notifications as unknown as Notification[],
        all,
        unread,
        read,
        fetchNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        markAllAsUnread
    }
})