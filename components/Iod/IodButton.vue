<template>
    <component class="iod-container iod-button"
        :is="is"
        :role="role"
        :disabled="disabled || loading"
        :area-disabled="disabled || loading"
        :aria-label="label"
        :class="classes">

        <div class="icon" v-if="iconLeft">{{iconLeft}}</div>
        <span class="content">
            <slot><span>{{label}}</span></slot>
        </span>
        <div class="icon" v-if="iconRight">{{iconRight}}</div>

        <IodineLoader type="spinner" class="spinner"/>

        <div class="border" v-if="border"></div>
        <div class="background"></div>
        <div class="overlay"></div>
    </component>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    import IodineLoader from './IodLoader.vue'



    const props = defineProps({
        is: {
            type: String,
            default: 'button'
        },
        variant: {
            type: String,
            default: 'filled',
        },
        colorPreset: {
            type: String,
        },
        label: {
            type: String,
            default: '',
        },
        iconLeft: {
            type: String,
        },
        iconRight: {
            type: String,
        },
        size: {
            type: String,
            default: 'normal',
        },
        shape: {
            type: String,
            default: 'radius-m',
        },
        border: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    })



    const role = computed((): string => {
        return ['a', 'Link'].includes(props.is) ? 'link' : 'button'
    })

    const classes = computed((): object => {
        return [
            `button-size-${props.size}`,
            `button-shape-${props.shape}`,
            `button-variant-${props.variant}`,
            `button-color-preset-${props.colorPreset}`,
            {
                'disabled': props.disabled,
                'loading': props.loading,
            }
        ]
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-button
        font-size: 1rem

        --local-color-background: var(--color-primary)
        --local-color-text: var(--color-on-primary)

        display: inline-flex
        align-items: center
        justify-content: center
        gap: .8em
        padding: 0 1em
        height: 2.5em
        text-align: center
        text-decoration: none
        text-transform: uppercase
        letter-spacing: .05em
        font-family: inherit
        font-weight: 500
        border-radius: var(--radius-m)
        border: none
        cursor: pointer
        user-select: none
        vertical-align: top
        position: relative
        background: transparent
        color: var(--local-color-text)
        box-sizing: border-box

        *
            box-sizing: inherit

        &:hover
            .overlay
                opacity: 0.1

        &:focus
            outline: none

            .overlay
                opacity: 0.17



        &.button-color-preset-success
            --local-color-background: var(--color-success)
            --local-color-text: var(--color-on-success)

        &.button-color-preset-info
            --local-color-background: var(--color-info)
            --local-color-text: var(--color-on-info)

        &.button-color-preset-warning
            --local-color-background: var(--color-warning)
            --local-color-text: var(--color-on-warning)

        &.button-color-preset-error
            --local-color-background: var(--color-error)
            --local-color-text: var(--color-on-error)



        &.button-variant-filled
            .background
                opacity: 1

        &.button-variant-contained
            --local-color-text: var(--local-color-background)

            .background
                opacity: .15 !important

        &.button-variant-text
            --local-color-text: var(--local-color-background)

            .background
                opacity: 0 !important



        &.button-size-small
            height: 2em
            padding: 0 .9em
            gap: .7em

        &.button-size-normal
            height: 2.5em
            padding: 0 1em
            gap: .8em

        &.button-size-large
            height: 3em
            padding: 0 1.75em
            gap: 1.55em



        &.button-shape-rect
            border-radius: 0px

        &.button-shape-radius-s
            border-radius: var(--radius-s)

        &.button-shape-radius-m
            border-radius: var(--radius-m)

        &.button-shape-radius-l
            border-radius: var(--radius-l)

        &.button-shape-radius-xl
            border-radius: var(--radius-xl)

        &.button-shape-pill
            border-radius: 1000px



        &.disabled,
        &.loading,
        &:disabled
            --local-color-background: var(--color-background-disabled)
            --local-color-text: var(--color-text-soft-disabled)
            cursor: initial

            .overlay
                display: none

            .border
                border-color: var(--color-border-disabled)



        &.loading
            .spinner
                opacity: 1

            .icon,
            .content
                opacity: 0



        .overlay,
        .background
            height: 100%
            width: 100%
            position: absolute
            top: 0
            left: 0
            border-radius: inherit
            opacity: 0
            transition: opacity 100ms
            pointer-events: none

            &.overlay
                background: currentColor

            &.background
                background: var(--local-color-background)
                opacity: 1

        .content
            font-size: .75rem
            font-weight: inherit
            letter-spacing: inherit
            position: relative
            z-index: 1

        .icon
            color: inherit
            font-size: 1em
            letter-spacing: 0
            font-weight: normal
            pointer-events: none
            vertical-align: top
            text-transform: lowercase
            font-family: var(--font-icon)
            position: relative
            z-index: 1

        .spinner
            position: absolute
            z-index: 1
            opacity: 0
            height: 1.25em
            width: 1.25em
            top: calc(50% - .625em)
            left: calc(50% - .625em)
            pointer-events: none

        .border
            height: 100%
            width: 100%
            position: absolute
            top: 0
            left: 0
            z-index: 2
            border-radius: inherit
            border: 1px solid var(--local-color-text)
            pointer-events: none
</style>