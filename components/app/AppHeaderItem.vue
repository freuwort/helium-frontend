<template>
    <component :is="is" type="button" class="header-item" :style="{ color }">
        <IodIcon class="app-icon"><slot>{{ icon }}</slot></IodIcon>
        <IodIcon class="chevron" v-if="showChevron">expand_more</IodIcon>
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

        &:hover
            .chevron
                transform: translateY(3px)
</style>
