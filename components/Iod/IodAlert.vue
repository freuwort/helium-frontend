<template>
    <div class="iod-container iod-alert" :class="classes">
        <h3 v-show="title">{{ title }}</h3>

        <Flex class="content">
            <slot></slot>
        </Flex>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
        colorPreset: {
            type: String,
        },
    })

    const classes = computed((): object => {
        return [
            `alert-color-preset-${props.colorPreset}`,
        ]
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-alert
        color: var(--color-text)
        border-radius: var(--radius-l)
        padding: 1rem
        display: flex
        flex-direction: column
        gap: 1rem
        position: relative

        &.alert-color-preset-success
            color: var(--color-success)

        &.alert-color-preset-info
            color: var(--color-info)

        &.alert-color-preset-warning
            color: var(--color-warning)

        &.alert-color-preset-error
            color: var(--color-error)

        &::before
            content: ''
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            z-index: 0
            pointer-events: none
            border-radius: inherit

        &::before
            background: currentColor
            mask: linear-gradient(to bottom right, #00000020, #00000010)

        h3
            position: relative
            z-index: 1
            margin: 0
            color: inherit

        .content
            position: relative
            z-index: 1
            margin: 0
            color: inherit

</style>