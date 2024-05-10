<template>
    <Transition name="slide">
        <IodAlert :title="title" color-preset="error" v-show="errors.length">
            <HeFlex class="error" v-for="error in errors">
                <HeFlex horizontal>
                    <span class="flex-1">{{ error?.data?.message || error?.message }}</span>
                </HeFlex>
                
                <ul v-if="error.statusCode === 422 && error?.data?.errors?.length > 1" class="m-0 pl-4">
                    <li v-for="hint in error?.data?.errors">
                        <small >{{ hint.join(' ') }}</small>
                    </li>
                </ul>
            </HeFlex>
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