<template>
    <div class="notification-wrapper" :class="{'unread': notification.read_at === null}" @click="toggle">
        <IodIcon class="icon"><slot name="icon">{{ icon }}</slot></IodIcon>
        <div class="indicator"></div>
        <div class="content">
            <div class="head">
                <slot>{{ message }}</slot>
                <small class="time">{{ dayjs(notification.created_at).fromNow()}}</small>
            </div>

            <div class="actions" v-if="$slots.actions" @click.stop>
                <slot name="actions"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import type { Notification } from '~~/types/notification'

    const dayjs = useDayjs()
    const notifications = useNotificationStore()

    const props = defineProps({
        notification: {
            type: Object as PropType<Notification>,
            required: true,
        },
        icon: {
            type: String,
            default: 'info',
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
        min-height: 3rem
        position: relative
        transition: all 100ms
        overflow: hidden
        color: var(--color-text-soft)

        &.unread .indicator
            opacity: 1

        &:hover:not(:disabled),
        &.active:not(:disabled)
            &:after
                opacity: .1

        &:after
            content: ''
            display: block
            position: absolute
            left: 0
            right: 0
            top: 0
            bottom: 0
            background-color: currentColor
            opacity: 0
            pointer-events: none
            transition: all 80ms ease-in-out

        .indicator
            position: absolute
            z-index: 0
            top: 50%
            right: .5rem
            translate: 0 -50%
            height: 8px
            aspect-ratio: 1
            border-radius: 50%
            background: var(--color-error)
            pointer-events: none
            transition: all 100ms
            opacity: 0

            &::before
                content: ''
                position: absolute
                z-index: 0
                top: -4px
                bottom: -4px
                left: -4px
                right: -4px
                border-radius: inherit
                background: inherit
                opacity: 0
                animation: pulse 3s linear infinite

                @keyframes pulse
                    0%
                        opacity: .0
                        scale: 0

                    70%
                        opacity: .4

                    100%
                        opacity: .0
                        scale: 1.5

        .icon
            color: inherit
            font-size: 1.5rem
            width: 4rem
            position: relative
            z-index: 1
            aspect-ratio: unset !important

        .content
            flex: 1
            display: flex
            flex-direction: column
            align-items: flex-start
            position: relative
            z-index: 1
            line-height: 1.5
            padding-block: 1rem
            padding-right: 2rem
            gap: .75rem

            .head .time
                display: block

            .actions
                display: flex
                align-items: center
                flex-wrap: wrap
</style>