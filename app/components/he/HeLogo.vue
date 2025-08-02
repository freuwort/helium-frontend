<template>
    <component :is="is" class="he-container he-logo" :href="href">
        <img class="image" :src="src" :alt="alt">
    </component>
</template>

<script lang="ts" setup>
    defineProps({
        is: {
            type: String,
            default: 'a',
        },
        src: {
            type: String,
            default: '',
        },
        href: {
            type: String,
            default: '',
        },
        alt: {
            type: String,
            default: '',
        },
    })
</script>

<style lang="sass" scoped>
    .he-container.he-logo
        display: inline-flex
        align-items: center
        justify-content: center
        height: 2rem

        .image
            display: block
            height: 100%
</style>