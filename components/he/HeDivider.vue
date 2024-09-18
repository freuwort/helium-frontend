<template>
    <hr class="he-container he-divider" :class="{'vertical': vertical}"/>
</template>

<script lang="ts" setup>
    defineProps({
        vertical: {
            type: Boolean,
            default: false,
        },
    })
</script>

<style lang="sass" scoped>
    .he-container.he-divider
        border-width: 0px
        border-style: solid
        border-color: var(--color-border)

        &:not(.vertical)
            border-top-width: 1px
            width: 100%
            
        &.vertical
            border-left-width: 1px
            width: unset

        &.focused
            border-color: var(--color-border-focused)
</style>