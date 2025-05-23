<template>
    <component class="iod-container iod-button iod-icon-button"
        :is="is"
        :role="role"
        :disabled="disabled || loading"
        :area-disabled="disabled || loading"
        :class="classes"
        :style="style">

        <IodIcon class="content"><slot>{{ icon }}</slot></IodIcon>

        <IodLoader type="spinner" class="spinner"/>

        <div class="border" v-if="border"></div>
        <div class="background"></div>
        <div class="overlay"></div>
    </component>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    import IodLoader from './IodLoader.vue'
    import IodIcon from './IodIcon.vue'



    const props = defineProps({
        is: {
            type: [String, Object, Function, Symbol, Array, Promise, Boolean, Number],
            default: 'button'
        },
        variant: {
            type: String,
            default: 'filled',
        },
        colorPreset: {
            type: String,
        },
        color: {
            type: String,
            default: '',
        },
        background: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
        iconFont: {
            type: String,
            default: '',
        },
        size: {
            type: String,
            default: 'm',
        },
        corner: {
            type: String,
            default: 'm',
        },
        shadow: {
            type: String,
            default: 'none',
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
        if (['a', 'Link'].includes(props.is as string)) return 'link'
        if (['button', 'Button'].includes(props.is as string)) return 'button'
        return ''
    })

    const classes = computed((): object => {
        return [
            `button-size-${props.size}`,
            `button-corner-${props.corner}`,
            `button-shadow-${props.shadow}`,
            `button-variant-${props.variant}`,
            `button-color-preset-${props.colorPreset}`,
            {
                'disabled': props.disabled,
                'loading': props.loading,
            }
        ]
    })

    const style = computed((): object => {
        const styles: Record<string, string> = {}
        if (props.background) styles['--local-color-background'] = props.background
        if (props.color) styles['--local-color-text'] = props.color
        if (props.iconFont) styles['--local-font'] = props.iconFont
        return styles
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-button
        font-size: 1rem

        --local-color-background: var(--color-text)
        --local-color-text: var(--color-background)
        --local-font: var(--font-icon)

        display: inline-flex
        align-items: center
        justify-content: center
        padding: 0
        height: 2.5em
        width: 2.5em
        text-align: center
        text-decoration: none
        text-transform: uppercase
        letter-spacing: .05em
        font-family: inherit
        font-weight: 500
        border-radius: var(--radius-m)
        border: none
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
            outline: 3px solid var(--color-info)
            outline-offset: -3px

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

        &.button-color-preset-primary
            --local-color-background: var(--color-primary)
            --local-color-text: var(--color-on-primary)

        &.button-color-preset-secondary
            --local-color-background: var(--color-secondary)
            --local-color-text: var(--color-on-secondary)

        &.button-color-preset-tertiary
            --local-color-background: var(--color-tertiary)
            --local-color-text: var(--color-on-tertiary)



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



        &.button-size-xs
            height: 1.5em
            width: 1.5em

            .content
                font-size: 1rem

        &.button-size-s
            height: 2em
            width: 2em

            .content
                font-size: 1.2rem

        &.button-size-m
            height: 2.5em
            width: 2.5em

            .content
                font-size: 1.4rem

        &.button-size-l
            height: 3em
            width: 3em

            .content
                font-size: 1.6rem

        &.button-size-xl
            height: 3.5em
            width: 3.5em

            .content
                font-size: 1.8rem



        &.button-corner-none
            border-radius: 0px

        &.button-corner-s
            border-radius: var(--radius-s)

        &.button-corner-m
            border-radius: var(--radius-m)

        &.button-corner-l
            border-radius: var(--radius-l)

        &.button-corner-xl
            border-radius: var(--radius-xl)

        &.button-corner-pill
            border-radius: 1000px



        &.button-shadow-none
            box-shadow: none

        &.button-shadow-s
            box-shadow: var(--shadow-s)

        &.button-shadow-m
            box-shadow: var(--shadow-m)

        &.button-shadow-l
            box-shadow: var(--shadow-l)



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
            font-size: 1.4rem
            font-weight: inherit
            font-family: var(--local-font) !important
            line-height: 0
            letter-spacing: inherit
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
            box-shadow: inset 0 0 1px var(--local-color-text)
            opacity: .75
            pointer-events: none
</style>