<template>
    <component :is="is" class="he-container he-card">
        <slot />
    </component>
</template>

<script lang="ts" setup>
    defineProps({
        is: {
            type: [String, Object, Function, Symbol, Array, Promise, Boolean, Number],
            default: 'div',
        },
    })
</script>

<style lang="sass" scoped>
    .he-container.he-card
        background: var(--color-background)
</style>