<template>
    <Teleport to="body">
        <FocusTrap :active="isOpen" @deactivate="close()">
            <div
                class="iod-container iod-popup popup-outer-wrapper"
                :class="{'open': isOpen}"
                :style="{'--local-blur': blur, '--local-max-width': maxWidth, '--local-color-backdrop': backdropColor, '--local-color-modal': modalColor}"
                @click.self.exact="closeOnBackdropClick()"
            >
                <div class="popup-inner-wrapper">
                    <div class="popup-content">
                        <slot></slot>
                    </div>
    
                    <div class="popup-header" v-if="!noHeader">
                        <h3>{{ title }}</h3>
                        <button class="close" @click="close()">
                            <code>esc</code>
                            <CloseIcon class="icon" />
                        </button>
                    </div>
                </div>
            </div>
        </FocusTrap>
    </Teleport>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { FocusTrap } from 'focus-trap-vue'

    import CloseIcon from './icons/CloseIcon.vue'


    const emits = defineEmits([
        'open',
        'close',
    ])

    const props = defineProps({
        title: {
            type: String,
            default: '',
        },
        shouldCloseOnBackdropClick: {
            type: Boolean,
            default: false,
        },
        noHeader: {
            type: Boolean,
            default: false,
        },
        blur: {
            type: String,
            default: '20px',
        },
        maxWidth: {
            type: String,
            default: '700px',
        },
        backdropColor: {
            type: String,
            default: 'rgb(33 34 36 / 80%)',
        },
        modalColor: {
            type: String,
            default: 'var(--color-background)',
        },
    })

    const isOpen = ref(false)



    function open()
    {
        isOpen.value = true
        emits('open')
    }

    function close()
    {
        isOpen.value = false
        emits('close')
    }

    function closeOnBackdropClick()
    {
        if (!props.shouldCloseOnBackdropClick) return

        close()
    }



    // Expose functions
    defineExpose({
        open,
        close,
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-popup
        --local-blur: 20px
        --local-max-width: 700px
        --local-color-backdrop: rgb(61 65 69 / 80%)
        --local-color-modal: var(--color-background)

        position: fixed
        z-index: 10000
        bottom: 0
        left: 0
        height: 100%
        width: 100%
        pointer-events: none
        background: transparent
        perspective: 1000px
        transition: background 300ms
        overflow-y: hidden
        box-sizing: border-box

        *
            box-sizing: inherit

        &.open
            pointer-events: all
            overflow-y: auto
            background: var(--local-color-backdrop)
            backdrop-filter: blur(var(--local-blur))
                
            .popup-inner-wrapper
                transform: rotateX(0deg)
                opacity: 1

        .popup-inner-wrapper
            position: relative
            z-index: 1
            width: calc(100% - 2rem)
            max-width: var(--local-max-width)
            margin: 6rem auto
            display: flex
            flex-direction: column
            transform-origin: center center -200px
            transform: rotateX(-10deg)
            opacity: 0
            transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1)

            &.slim
                max-width: 450px

            .popup-header
                display: flex
                align-items: flex-end
                padding: 1rem
                border-radius: var(--radius-l)
                
                h3
                    flex: 1
                    margin: 0
                    font-size: 1.4rem
                    color: #ffffff
                    white-space: nowrap
                    text-overflow: ellipsis
                    overflow: hidden

                .close
                    flex: none
                    position: relative
                    display: flex
                    align-items: center
                    gap: 1rem
                    padding: 0
                    padding-left: 1rem
                    user-select: none
                    outline: none
                    border: none
                    background: none
                    font-size: inherit
                    text-align: inherit
                    border-radius: 2.5rem
                    cursor: pointer

                    &:focus > .icon
                        background: #ffffff30
                        border-color: #ffffff
                        color: #ffffff
                        box-shadow: 0 0 0 4px #ffffff30

                    &:hover > .icon
                        background: #ffffff30
                        border-color: #ffffff40
                        color: #ffffff
                        box-shadow: 0 0 0 4px #ffffff30
                    
                    > .icon
                        display: grid
                        place-content: center
                        width: 2.5rem
                        height: 2.5rem
                        padding: .5rem
                        border-radius: 50%
                        background: #ffffff20
                        color: #ffffff
                        border: 1px solid #ffffff30
                        font-size: 1.35rem
                        line-height: 1
                        font-family: var(--font-icon)
                        transition: all 50ms
                    
                    > code
                        color: #ffffffdd
                        padding: 0
                        text-transform: uppercase
                        font-weight: 700
                        letter-spacing: .05rem
                        background: transparent
                        border-radius: unset

            .popup-content
                background: var(--local-color-modal)
                border-radius: var(--radius-l)
                display: flex
                flex-direction: column
                order: 1
</style>