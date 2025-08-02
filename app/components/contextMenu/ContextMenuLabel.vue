<template>
    <span class="context-menu-label"><slot>{{ label }}</slot></span>
</template>

<script lang="ts" setup>
    defineProps({
        label: String
    })
</script>

<style lang="sass" scoped>
    .context-menu-label
        display: flex
        align-items: center
        min-height: 2rem
        font-size: .75rem
        font-weight: 500
        font-family: var(--font-heading)
        letter-spacing: .05rem
        text-transform: uppercase
        padding-inline: 1rem
        user-select: none
</style>