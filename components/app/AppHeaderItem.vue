<template>
    <component :is="is" type="button" class="header-item" :style="{ color }">
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
        min-height: 4rem
        display: flex
        align-items: center
        justify-content: center
        aspect-ratio: 1
        color: var(--color-text-soft)
        user-select: none
        position: relative

        .app-icon
            font-size: 1.75rem
            color: inherit
            height: 100%

        .chevron
            position: absolute
            right: 0
            font-size: 1rem
            color: var(--color-text-soft)
            transition: transform 80ms ease-in-out

        .badge
            display: flex
            align-items: center
            position: absolute
            top: .5rem
            right: .5rem
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

        &:hover
            .chevron
                transform: translateY(3px)
</style>
