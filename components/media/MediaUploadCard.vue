<template>
    <Transition name="slide">
        <Card class="upload-card" key="card" v-show="uploadManager.status.total > 0">
            <TransitionGroup name="fade">
                <div class="header" key="header">
                    <span class="flex-1">{{ uploadManager.statusText || 'Keine Uploads' }} </span>
                    <IodIconButton type="button" variant="text" size="small" icon="expand_less"/>
                    <IodIconButton type="button" variant="text" size="small" icon="close" @click="uploadManager.clearAll()" />
                </div>
                <div class="content small-scrollbar" key="content">
                    <TransitionGroup name="fade">
                        <div class="upload" v-for="upload in uploadManager.uploads" :key="upload.id" :data-status="upload.status">
                            <div class="progress" :style="`transform: scaleX(${upload.progress / 100})`"></div>
                            <span class="flex-1">{{ upload.name }}</span>
                            <IodIconButton type="button" variant="text" size="small" icon="close" @click="uploadManager.cancel(upload.id)" />
                        </div>
                    </TransitionGroup>
                </div>
            </TransitionGroup>
        </Card>
    </Transition>
</template>

<script lang="ts" setup>
    const uploadManager = useUploadStore()
</script>

<style lang="sass" scoped>
    .fade-move,
    .fade-enter-active,
    .fade-leave-active
        transition: all 200ms ease-in-out !important

    .fade-enter-from,
    .fade-leave-to
        opacity: 0

    .fade-leave-active
        position: absolute



    .slide-move,
    .slide-enter-active,
    .slide-leave-active
        transition: all 200ms ease-in-out !important

    .slide-enter-from,
    .slide-leave-to
        transform: translateY(100%)

    .slide-leave-active
        position: absolute



    .upload-card
        display: flex
        flex-direction: column
        border: none
        border-radius: var(--radius-l) var(--radius-l) 0 0
        box-shadow: var(--shadow-elevation-high)
        position: fixed
        z-index: 100
        bottom: 0
        right: 1rem
        width: calc(100% - 2rem)
        max-width: 22rem
        user-select: none
        transition: all 200ms ease-in-out

        .header
            display: flex
            align-items: center
            background: var(--color-text)
            color: var(--color-background)
            border-top-left-radius: inherit
            border-top-right-radius: inherit
            height: 3.5rem
            padding-inline: 1rem .5rem !important

            .iod-button
                --local-color-background: var(--color-background)

        .content
            display: flex
            flex-direction: column
            max-height: 30rem
            overflow-y: auto

        .upload
            flex: none
            display: flex
            align-items: center
            padding-inline: 1rem .5rem !important
            height: 3.5rem
            width: 100%
            color: var(--color-text)
            position: relative

            &:hover
                background: var(--color-background-soft)

            .progress
                content: ''
                position: absolute
                top: 0
                bottom: 0
                left: 0
                right: 0
                z-index: -1
                user-select: none
                pointer-events: none
                background: transparent
                opacity: 0
                transform-origin: left
                transform: scaleX(0)
                transition: all 100ms ease-in-out, transform 200ms ease-in-out, opacity 500ms ease-in-out
                mask-image: linear-gradient(to right, #00000066, #000000ff)

            &[data-status="uploading"]
                color: var(--color-blue)
                .progress
                    background: var(--color-blue)
                    opacity: .2

            &[data-status="completed"]
                color: var(--color-green)
                .progress
                    opacity: 0

            &[data-status="cancelled"]
                color: var(--color-red)
                .progress
                    background: var(--color-red)
                    opacity: .2

            .iod-button
                --local-color-background: currentColor
</style>