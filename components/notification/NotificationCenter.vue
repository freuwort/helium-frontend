<template>
    <ContextMenu class="min-w-80 !pt-2">
        <div class="overflow-y-auto small-scrollbar max-h-[80vh]">
            <template v-for="notification in notifications.all" :key="notification.id">
                <Notification v-if="notification.type === 'user-verified-their-email'" :notification="notification">
                    <b><NuxtLink :to="`/users/editor/${notification.data.id}`">{{ notification.data.name }}</NuxtLink></b> wartet auf Freigabe
    
                    <template #actions>
                        <IodButton :is="NuxtLink" size="s" corner="pill" icon-left="check" label="Freigeben" variant="contained" :to="`/users/editor/${notification.data.id}?action=enable`"/>
                    </template>
                </Notification>
            </template>
        </div>
        <IodAlert as="placeholder" class="h-20" v-if="!notifications.all.length">
            <span>Keine Benachrichtigungen</span>
        </IodAlert>
        <ContextMenuDivider class="mt-2"/>
        <ContextMenuItem icon="mark_chat_read" label="Alle als gelesen markieren" @click="notifications.markAllAsRead()"/>
    </ContextMenu>
</template>

<script lang="ts" setup>
    const notifications = useNotificationStore()
    const NuxtLink = defineNuxtLink({})
</script>

<style lang="sass" scoped>
</style>