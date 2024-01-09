<template>
    <component :is="is" type="button" class="header-item" :style="{ color }">
        <Icon class="app-icon"><slot>{{ icon }}</slot></Icon>
        <Icon class="chevron" v-if="showChevron">expand_more</Icon>
    </component>
</template>

<script lang="ts" setup>
    defineProps({
        is: {
            type: [String, Object, Function, Symbol, Array, Promise, Boolean, Number],
            default: 'button',
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

        .app-icon
            font-size: 1.75rem
            color: inherit
            height: 100%

        .chevron
            font-size: 1rem
            color: var(--color-text-soft)
            transition: transform 80ms ease-in-out

        &:hover
            .chevron
                transform: translateY(3px)
</style>
