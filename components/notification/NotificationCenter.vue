<template>
    <ContextMenu class="min-w-[26rem] !pb-0">
        <div class="flex items-center gap-1 px-1">
            <IodButton class="flex-1 !normal-case !tracking-normal" corner="pill" :variant="filter === 'unread'? 'contained' : 'text'" :label="`Ungelesen (${notifications.unread.length})`" @click="filter = 'unread'"/>
            <IodButton class="flex-1 !normal-case !tracking-normal" corner="pill" :variant="filter === 'all'? 'contained' : 'text'" :label="`Alle (${notifications.all.length})`" @click="filter = 'all'"/>
            <HeDivider vertical class="h-8"/>
            <VDropdown placement="bottom-end">
                <IodIconButton corner="pill" variant="text" icon="more_vert" v-tooltip="'Mehr Optionen'"/>
                <template #popper>
                    <ContextMenu>
                        <ContextMenuItem @click="notifications.markAllAsRead()" v-close-popper icon="mark_chat_read">Alle als gelesen markieren</ContextMenuItem>
                        <ContextMenuItem @click="notifications.fetchNotifications()" v-close-popper icon="refresh">Aktualisieren</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
        </div>
        <ContextMenuDivider class="!mb-0"/>

        <div class="notification-container small-scrollbar" v-if="filteredNotifications.length">
            <template v-for="notification in filteredNotifications" :key="notification.id">
                <Notification icon="person" v-if="notification.type === 'user-verified-their-email'" :notification="notification">
                    <b>{{ notification.data.name }}</b> wartet auf Freigabe
    
                    <template #actions>
                        <IodButton :is="NuxtLink" size="s" corner="pill" icon-left="check" label="Freigeben" variant="filled" :to="`/users/editor/${notification.data.id}?action=enable`"/>
                    </template>
                </Notification>

                <Notification icon="deployed_code" v-if="notification.type === 'system-update'" :notification="notification">
                    Ihr System wurde auf <b>Version {{ notification.data.version }}</b> aktualisiert.
                </Notification>
            </template>
        </div>
        <IodAlert type="placeholder" class="h-40" text="Keine Benachrichtigungen" v-else/>
    </ContextMenu>
</template>

<script lang="ts" setup>
import HeDivider from '../he/HeDivider.vue';

    const notifications = useNotificationStore()
    const NuxtLink = defineNuxtLink({})

    const filter = ref('unread')
    const filteredNotifications = computed(() => {
        if (filter.value === 'all') return notifications.all
        if (filter.value === 'unread') return notifications.unread

        return []
    })
</script>

<style lang="sass" scoped>
    .notification-container
        overflow-y: auto
        max-height: 40rem

        .notification-wrapper:not(:last-child)
            border-bottom: 1px solid var(--color-border)
</style>