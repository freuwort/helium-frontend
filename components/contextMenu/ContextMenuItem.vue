<template>
    <HeFlex :is="is ?? NuxtLink" type="button" horizontal class="context-menu-item" :class="{'active': active}" :style="{ color }">
        <IodIcon class="main-icon"><slot name="icon">{{ icon }}</slot></IodIcon>
        <HeFlex class="flex-1">
            <span class="label"><slot>{{ label }}</slot></span>
        </HeFlex>
        <slot name="right"></slot>
        <IodIcon class="chevron-icon" v-if="showChevron">chevron_right</IodIcon>
    </HeFlex>
</template>

<script lang="ts" setup>
    defineProps({
        is: {
            type: [String, Object, Function, Array],
        },
        label: String,
        icon: String,
        color: String,
        showChevron: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: false,
        },
    })

    const NuxtLink = defineNuxtLink({})
</script>

<style lang="sass" scoped>
    .context-menu-item
        display: flex
        align-items: stretch
        min-height: 3rem
        user-select: none
        color: var(--color-text-soft)
        position: relative
        overflow-x: hidden
        text-decoration: none

        &:after
            content: ''
            display: block
            position: absolute
            left: 0
            right: 0
            top: 0
            bottom: 0
            background-color: currentColor
            opacity: 0
            pointer-events: none
            transition: all 80ms ease-in-out

        &:hover:not(:disabled),
        &.active:not(:disabled)
            &:after
                opacity: .1

            .label
                color: inherit

            .chevron-icon
                color: inherit
                transform: translateX(5px)

        &:disabled
            cursor: default
            color: var(--color-text-soft-disabled) !important

            &:after
                opacity: 0

            .label,
            .chevron-icon
                color: inherit

    .main-icon
        color: inherit
        font-size: 1.5rem
        width: 4rem
        position: relative
        z-index: 1
        aspect-ratio: unset !important

    .label
        color: var(--color-text-soft)
        position: relative
        z-index: 1
        display: flex
        align-items: center
        transition: all 80ms ease-in-out
        padding-right: 1rem


    .chevron-icon
        color: var(--color-text-soft)
        font-size: 1.25rem
        width: 4rem
        position: relative
        z-index: 1
        transition: all 80ms ease-in-out
        aspect-ratio: unset !important
</style>