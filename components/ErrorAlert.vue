<template>
    <Transition name="slide">
        <IodAlert :title="title" color-preset="error" v-show="errors.length">
            <Flex class="error" v-for="error in errors">
                <Flex horizontal>
                    <span class="flex-1">{{ error?.data?.message || error?.message }}</span>
                </Flex>
                
                <ul v-if="error.statusCode === 422 && error?.data?.errors?.length > 1" class="margin-0 padding-left-1">
                    <li v-for="hint in error?.data?.errors">
                        <small >{{ hint.join(' ') }}</small>
                    </li>
                </ul>
            </Flex>
        </IodAlert>
    </Transition>
</template>

<script lang="ts" setup>
    import type { NuxtError } from "nuxt/app"

    defineProps({
        title: {
            type: String,
            default: '',
        },
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