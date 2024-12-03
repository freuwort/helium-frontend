<template>
    <component :is="is" type="button" class="header-item" :class="{ 'show-chevron': showChevron }" :style="{ color }">
        <IodIcon class="app-icon"><slot>{{ icon }}</slot></IodIcon>
        <IodIcon class="chevron" v-if="showChevron">expand_more</IodIcon>
        <span class="badge" :class="{'simple': simpleBadge}" v-if="badge">{{ badge }}</span>
    </component>
</template>

<script lang="ts" setup>
    defineProps({
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
        color: String,
        showChevron: {
            type: Boolean,
            default: false,
        },
    })
</script>

<style lang="sass" scoped>
    .header-item
        min-height: 3rem
        display: flex
        align-items: center
        justify-content: center
        aspect-ratio: 1
        color: var(--color-text-soft)
        user-select: none
        position: relative
        border-radius: .5rem

        &:hover:not(:disabled)
            background-color: var(--color-background-soft)

            .chevron
                transform: translateY(3px)

        &:focus
            outline: 3px solid var(--color-info)

        &:disabled
            color: var(--color-text-soft-disabled) !important

        &.show-chevron
            padding-right: .6rem

        .app-icon
            position: relative
            z-index: 1
            font-size: 1.75rem
            color: inherit
            height: 100%

        .chevron
            position: absolute
            z-index: 2
            right: .05rem
            font-size: 1rem
            color: var(--color-text-soft-disabled)
            transition: transform 80ms ease-in-out

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
</style>
