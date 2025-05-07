<template>
    <div class="iod-container iod-alert" :class="classes">
        <div class="content">
            <IodIcon :icon v-if="icon"/>
            <div>
                <slot>{{ text }}</slot>
            </div>
        </div>
        <div class="border" v-if="border"></div>
    </div>
</template>

<script lang="ts" setup>
    type Type = 'success' | 'info' | 'warning' | 'error' | 'placeholder' | 'default'



    const props = defineProps({
        type: {
            type: String as PropType<Type>,
            default: 'default',
        },
        border: {
            type: Boolean,
            default: false,
        },
        icon: String,
        text: String,
    })

    const icon = computed(() => {
        if (props.icon) return props.icon
        switch (props.type) {
            case 'success': return 'check_circle'
            case 'info': return 'info'
            case 'warning': return 'warning'
            case 'error': return 'report'
            default: return null
        }
})

    const classes = computed(() => ([
        `alert-type-${props.type}`,
    ]))
</script>

<style lang="sass" scoped>
    .iod-container.iod-alert
        border-radius: var(--radius-m)
        padding: .75rem 1rem
        display: flex
        flex-direction: column
        gap: 1rem
        position: relative

        &::before
            display: none
            content: ''
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            z-index: 0
            pointer-events: none
            border-radius: inherit
            background: currentColor
            opacity: .07

        .content
            flex: 1
            display: flex
            align-items: center
            gap: 1rem
            line-height: 1.5
            position: relative
            z-index: 1
            margin: 0
            color: inherit

        .border
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            border-radius: inherit
            border: 1px solid currentColor

        &.alert-type-default::before,
        &.alert-type-info::before,
        &.alert-type-success::before,
        &.alert-type-warning::before,
        &.alert-type-error::before
            display: block

        &.alert-type-default
            color: var(--color-text)

        &.alert-type-success
            color: var(--color-success)

        &.alert-type-info
            color: var(--color-info)

        &.alert-type-warning
            color: var(--color-warning)

        &.alert-type-error
            color: var(--color-error)

        &.alert-type-placeholder
            color: var(--color-text-soft-disabled)
            user-select: none
            padding-block: 0

            .content
                text-align: center
                align-items: center
                justify-content: center
</style>