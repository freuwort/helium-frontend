<template>
    <span class="iod-container iod-icon" aria-hidden="true">
        <template v-if="imageIcon">
            <img :src="icon" />
        </template>
        <template v-else>
            <slot>{{ icon }}</slot>
        </template>
    </span>
</template>

<script setup lang="ts">
    defineProps({
        icon: {
            type: String,
            required: true
        },
        imageIcon: {
            type: Boolean,
            default: false
        }
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-icon
        display: inline-flex
        align-items: center
        justify-content: center
        color: inherit
        font-size: 24px
        height: 24px
        width: 24px
        font-weight: 400 !important
        font-family: var(--font-icon)
        line-height: 1
        object-fit: contain
        user-select: none
        box-sizing: border-box

        *
            box-sizing: inherit

        img
            height: inherit
            width: inherit
            object-fit: inherit
</style>