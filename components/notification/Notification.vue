<template>
    <div class="notification-wrapper" :class="{'unread': notification.read_at === null}" @click="toggle">
        <div class="main-content flex flex-col">
            <span class="message" v-if="$slots.default || message">
                <slot>{{ message }}</slot>
            </span>
            <small class="time" v-tooltip.bottom="dayjs(notification.created_at).format('DD.MM.YYYY HH:mm')">{{ dayjs(notification.created_at).fromNow()}}</small>

        </div>
        <div class="actions flex flex-wrap" v-if="$slots.actions" @click.stop>
            <slot name="actions"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import type { Notification } from '~/types/notification'

    const dayjs = useDayjs()
    const notifications = useNotificationStore()

    const props = defineProps({
        notification: {
            type: Object as PropType<Notification>,
            required: true,
        },
        message: {
            type: String,
            default: '',
        },
    })

    function toggle() {
        if (props.notification.read_at === null) notifications.markAsRead(props.notification)
        else notifications.markAsUnread(props.notification)
    }
</script>

<style lang="sass" scoped>
    .notification-wrapper
        display: flex
        flex-direction: column
        gap: .75rem
        padding: .75rem
        margin-inline: .25rem
        border-radius: var(--radius-l)
        position: relative
        transition: all 100ms
        overflow: hidden

        &::after
            content: ''
            position: absolute
            z-index: 0
            top: 1rem
            right: 1rem
            height: .5rem
            width: .5rem
            border-radius: 50%
            background: var(--color-error)
            transition: all 100ms
            opacity: 0

        &::before
            content: ''
            position: absolute
            z-index: 0
            top: 0
            right: 0
            height: 5rem
            width: 5rem
            background: linear-gradient(45deg, #ff000000 50%, var(--color-error))
            transition: all 100ms
            opacity: 0

        &.unread::after
            opacity: 1
        &.unread::before
            opacity: .2

        &:hover
            background: var(--color-background-soft)

        .main-content
            display: flex
            flex-direction: column
            align-items: flex-start
            position: relative
            z-index: 1
            color: var(--color-text-soft)
            line-height: 1.5

        .actions
            position: relative
            z-index: 1
            margin-right: auto
            margin-left: -.1rem
            margin-bottom: -.1rem
</style>