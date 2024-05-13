<template>
    <div class="splashscreen" :class="splashscreen.status">
        <div class="splashscreen-logo">
            <img src="/images/app/logo.svg" alt="Logo">
            <IodLoader class="spinner" :thickness=".8"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const splashscreen = useSplashscreenStore()
</script>

<style lang="sass" scoped>
    .splashscreen
        position: fixed
        top: 0
        bottom: 0
        left: 0
        right: 0
        background-color: var(--color-background)
        z-index: 999999
        display: flex
        justify-content: center
        align-items: center
        user-select: none
        opacity: 0
        pointer-events: none
        transition: all 300ms ease-in-out

        &.idle
            opacity: 0
            pointer-events: none

        &.loading,
        &.finished
            opacity: 1
            pointer-events: all

        &.finished
            .splashscreen-logo
                img
                    transform: scale(.8)

                .spinner
                    opacity: 0

        .splashscreen-logo
            width: 200px
            height: 200px
            position: relative

            img
                position: absolute
                top: 0
                left: 0
                height: 100%
                width: 100%
                transform: scale(.3)
                transition: all 300ms cubic-bezier(0.7, -1.40, 1, 0.1)

            .spinner
                position: absolute
                top: 0
                left: 0
                height: 100%
                width: 100%
                pointer-events: none
                color: var(--color-primary)
                transition: all 300ms ease-in-out
</style>