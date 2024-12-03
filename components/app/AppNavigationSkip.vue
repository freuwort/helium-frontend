<template>
    <a class="navigation-skip" tabindex="0">
        <slot>{{ label }}</slot>
        <IodIcon v-if="icon" :icon/>
    </a>
</template>

<script lang="ts" setup>
    defineProps({
        label: String,
        icon: String,
    })
</script>

<style lang="sass" scoped>
    .navigation-skip
        position: fixed
        z-index: 1000
        top: calc(4.5rem + 2px)
        left: .5rem
        display: flex
        align-items: center
        gap: .5rem
        padding: .5rem 1rem
        border-radius: .25rem
        background: var(--color-info)
        color: var(--color-on-info)
        opacity: 0
        pointer-events: none
        transform: translateY(-1rem)
        transition: all 100ms

        &:focus
            opacity: 1
            pointer-events: all
            transform: translateY(0)
            outline: none

        .iod-icon
            font-size: 1rem
</style>