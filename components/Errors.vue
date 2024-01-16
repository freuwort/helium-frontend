<template>
    <div class="error-modal" v-show="sessionErrorStore.hasErrors()">
        <h3 v-show="title">{{ title }}</h3>

        <Flex class="error-wrapper" gap=".5rem">
            <Flex class="error" v-for="error in sessionErrorStore.errors">
                <Flex horizontal>
                    <span class="flex-1">{{ error?.data?.message || error?.message }}</span>
                    <button type="button" @click="sessionErrorStore.removeError(error)"><IodIcon icon="close"/></button>
                </Flex>
                
                <ul v-if="error.statusCode === 422" class="margin-0 padding-left-1">
                    <li v-for="hint in error?.data?.errors">
                        <small >{{ hint.join(' ') }}</small>
                    </li>
                </ul>
            </Flex>
        </Flex>
    </div>
</template>

<script lang="ts" setup>
    const sessionErrorStore = useSessionErrorStore()

    defineProps({
        title: {
            type: String,
            default: '',
        },
    })
</script>

<style lang="sass" scoped>
    .error-modal
        color: var(--color-error)
        border-radius: var(--radius-l)
        padding: 1.5rem
        display: flex
        flex-direction: column
        gap: 1rem
        position: relative

        &::before,
        &::after
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

        &::after
            border: 1px solid currentColor
            opacity: .1

        h3
            position: relative
            z-index: 1
            margin: 0
            color: inherit

        .error-wrapper
            position: relative
            z-index: 1
            margin: 0
            color: inherit

            .error
                &:hover button
                    opacity: 1
                    pointer-events: all

                button
                    opacity: 0
                    pointer-events: none

                    .iod-icon
                        font-size: 1.25rem

</style>