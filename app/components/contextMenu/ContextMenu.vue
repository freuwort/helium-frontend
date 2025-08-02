<template>
    <div class="context-menu">
        <slot />
    </div>
</template>

<script lang="ts" setup>
</script>

<style lang="sass" scoped>
    .context-menu
        display: flex
        flex-direction: column
        padding-block: .5rem
</style>
