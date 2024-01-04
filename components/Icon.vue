<script lang="ts" setup>
    const props = defineProps({
        icon: String,
    })
</script>

<template>
    <div class="icon">
        <slot>{{ icon }}</slot>
    </div>
</template>

<style scoped lang="sass">
    .icon
        font-family: var(--font-icon)
        display: flex
        align-items: center
        justify-content: center
        user-select: none
</style>
