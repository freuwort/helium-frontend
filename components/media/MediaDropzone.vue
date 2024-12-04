<template>
    <div
        class="dropzone"
        :class="{'dragover': dragOver}"
        @drop="onDrop"
        @dragover="onDragOver"
        @dragend="onDragStop"
        @dragleave="onDragStop"
    >
        <slot></slot>
        <div class="drag-indicator"></div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        enabled: {
            type: Boolean,
            default: true,
        },
        accept: {
            type: Array as PropType<string[]>,
            default: () => ['Files', 'text/plain']
        }
    })

    const dragOver = ref(false)

    function onDragOver(event: DragEvent) {
        event.preventDefault()

        if (!event.dataTransfer) return

        if (!props.enabled) {
            event.dataTransfer.dropEffect = 'none'
            return
        }

        if (!arrayIntersect(props.accept, event.dataTransfer?.types as string[]).length) {
            event.dataTransfer.dropEffect = 'none'
            return
        }

        dragOver.value = true
    }

    function onDragStop(event: DragEvent) {
        event.preventDefault()
        dragOver.value = false
    }

    function onDrop(event: DragEvent) {
        event.preventDefault()
        
        if (!dragOver.value) return
        
        dragOver.value = false
        emits('drop', event)
    }

    const emits = defineEmits(['drop'])
</script>

<style lang="sass" scoped>
    .dropzone
        position: relative

        &.dragover
            > .drag-indicator
                opacity: 1
                inset: 0

        > .drag-indicator
            position: absolute
            z-index: 100
            inset: -.75rem
            border-radius: inherit
            pointer-events: none
            opacity: 0
            transition: all 100ms
            will-change: opacity, inset

            &::after,
            &::before
                content: ''
                position: absolute
                inset: 0
                border-radius: inherit

            &::before
                z-index: 1
                opacity: .3
                background: var(--color-info)

            &::after
                z-index: 2
                border: 2px dashed var(--color-info)
</style>