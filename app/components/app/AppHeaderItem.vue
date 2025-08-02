<template>
    <component :is="is" type="button" class="header-item" :class="{ 'active': active }">
        <IodIcon class="app-icon"><slot>{{ icon }}</slot></IodIcon>
        <span class="badge" :class="{'simple': simpleBadge}" v-if="badge">{{ badge }}</span>
        <div class="corner left"></div>
        <div class="corner right"></div>
    </component>
</template>

<script lang="ts" setup>
    const props = defineProps({
        is: {
            type: [String, Object, Function, Symbol, Array, Promise, Boolean, Number],
            default: 'button',
        },
        badge: {
            type: [String, Number, null],
            default: null,
        },
        simpleBadge: {
            type: Boolean,
            default: false,
        },
        icon: String,
        routeGroup: {
            type: String,
            default: null,
        },
    })

    const active = computed(() => {
        return useRoute().path.startsWith(props.routeGroup) && props.routeGroup !== null
    })
</script>

<style lang="sass" scoped>
    .header-item
        height: 100%
        display: flex
        align-items: center
        justify-content: center
        aspect-ratio: 1
        color: var(--color-text-soft)
        user-select: none
        position: relative
        border-top-left-radius: var(--radius-m)
        border-top-right-radius: var(--radius-m)

        &::after
            content: ''
            position: absolute
            right: 1.25rem
            left: 1.25rem
            bottom: .5rem
            background: currentColor
            height: 2.5px
            border-radius: .5rem
            opacity: 0
            transition: opacity 100ms ease-in-out

        &:hover,
        &:focus,
        &.active
            color: var(--color-info)
            background: var(--color-background)

        &:hover
            z-index: 1

            .corner
                opacity: 1

        &:focus
            z-index: 2
            border-radius: 3px
            outline: 3px solid var(--color-info)
            outline-offset: -3px

        &:disabled
            color: var(--color-text-soft-disabled) !important
            background: var(--color-background-disabled) !important

        &.active
            z-index: 3

            &::after
                opacity: 1

            .corner
                opacity: 1

        .app-icon
            position: relative
            z-index: 1
            font-size: 1.5rem
            color: inherit
            height: 100%

        .badge
            position: absolute
            z-index: 3
            top: .5rem
            right: .5rem
            display: flex
            align-items: center
            height: 1.1rem
            line-height: 100%
            padding-inline: .4rem
            background: var(--color-error)
            color: var(--color-on-error)
            border-radius: 5rem
            font-size: .75rem

            &.simple
                top: .8rem
                right: .8rem
                font-size: 0
                height: .5rem
                width: .5rem
                padding: 0

        .corner
            position: absolute
            width: var(--radius-m)
            height: var(--radius-m)
            overflow: hidden
            pointer-events: none
            bottom: 0
            opacity: 0

            &::after
                content: ''
                position: absolute
                top: -100%
                width: 200%
                height: 200%
                border-radius: 50%
                box-shadow: 0 0 0 100rem var(--color-background)

            &.left
                right: 100%
                &::after
                    left: -100%

            &.right
                left: 100%
                &::after
                    right: -100%
</style>
