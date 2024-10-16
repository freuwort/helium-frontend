<template>
    <Transition name="slide">
        <IodAlert type="error" v-show="errors.length">
            <template v-for="error in errors">
                {{ error.message }}<br>
            </template>
        </IodAlert>
    </Transition>
</template>

<script lang="ts" setup>
    import type { NuxtError } from "nuxt/app"

    defineProps({
        errors: {
            type: Array as PropType<NuxtError[]>,
            default: () => [],
        },
    })
</script>

<style lang="sass" scoped>
    .iod-alert
        &.slide-enter-active,
        &.slide-leave-active
            transition: all 200ms ease

        &.slide-enter-from
            transform: translateY(-10px)
            opacity: 0

        &.slide-leave-to
            opacity: 0
            transform: scale(.8)
</style>