<template>
    <VDropdown placement="bottom-center" :distance="-1">
        <Transition name="slide">
            <div class="upload-button" key="card" v-show="uploadManager.status.total > 0" :class="{
                'uploading': uploadManager.status.uploading,
                'completed': uploadManager.status.completed,
                'cancelled': uploadManager.status.cancelled,
            }" v-tooltip="uploadManager.statusText">
                <IodProgress type="bar" :progress="uploadManager.totalProgress"/>
                <IodIcon :icon="icon"/>
            </div>
        </Transition>

        <template #popper>
            <MediaUploadCard class="!w-80" v-show="uploadManager.status.total > 0"/>
        </template>
    </VDropdown>
</template>

<script lang="ts" setup>
    const uploadManager = useUploadStore()

    const icon = computed(() => {
        if (uploadManager.status.uploading) return 'upload'
        if (uploadManager.status.completed) return 'check'
        if (uploadManager.status.cancelled) return 'close'
    })
</script>

<style lang="sass" scoped>
    .slide-enter-active,
    .slide-leave-active
        transition: all 100ms ease-out !important

    .slide-enter-from,
    .slide-leave-to
        transform: translateY(1rem)
        opacity: 0

    .slide-leave-active
        position: absolute



    @keyframes pulse
        0%
            opacity: 1

        50% 
            opacity: .5

        100%     
            opacity: 1



    .upload-button
        aspect-ratio: 1
        height: 3rem
        position: relative
        border-radius: var(--radius-m)
        color: var(--color-text-soft)

        &.completed
            color: var(--color-success)

        &.cancelled
            color: var(--color-error)

        &.uploading
            color: var(--color-info)

            .iod-icon
                bottom: .5rem
                animation: pulse 2s infinite

            .iod-progress
                opacity: 1

        &::before
            content: ''
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            border-radius: inherit
            background-color: currentColor
            opacity: .1

        .iod-icon
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            aspect-ratio: unset
            transition: all 100ms ease-out

        .iod-progress
            position: absolute
            left: .5rem
            right: .5rem
            bottom: .5rem
            border-radius: 1rem
            width: unset !important
            color: inherit !important
            opacity: 0
            pointer-events: none
            transition: all 100ms ease-out
</style>