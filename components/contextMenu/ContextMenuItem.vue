<template>
    <Layout is="button" type="button" horizontal class="context-menu-item" :style="{ color }">
        <Icon class="main-icon"><slot name="icon">{{ icon }}</slot></Icon>
        <Layout class="flex-1">
            <span class="label"><slot>{{ label }}</slot></span>
        </Layout>
        <Icon class="chevron-icon" v-if="showChevron">chevron_right</Icon>
    </Layout>
</template>

<script lang="ts" setup>
    defineProps({
        label: String,
        icon: String,
        color: String,
        showChevron: {
            type: Boolean,
            default: false,
        },
    })
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

        &:hover
            &:after
                opacity: .1

            .label
                color: inherit

            .chevron-icon
                color: inherit
                transform: translateX(5px)

    .main-icon
        color: inherit
        font-size: 1.5rem
        width: 4rem
        position: relative
        z-index: 1

    .label
        color: var(--color-text-soft)
        font-size: .875rem
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
</style>