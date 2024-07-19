<template>
    <Transition name="slide">
        <div class="upload-button" key="card" v-show="uploadManager.status.uploading">
            <IodProgress :progress="uploadManager.totalProgress"/>
        </div>
    </Transition>
</template>

<script lang="ts" setup>
    const uploadManager = useUploadStore()
</script>

<style lang="sass" scoped>
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
        border-radius: var(--radius-l) var(--radius-l) 0 0 !important
        box-shadow: var(--shadow-m)
        position: fixed
        z-index: 100
        bottom: 0
        right: 1rem
        padding: .25rem
        gap: .25rem
        width: calc(100% - 2rem)
        max-width: 22rem
        user-select: none
        transition: all 200ms ease-in-out

        .header
            display: flex
            font-weight: 500
            align-items: center
            color: var(--color-text)
            border-radius: var(--radius-m)
            height: 3rem
            background: var(--color-background-soft)
            padding-inline: 1rem .5rem !important

            .iod-button
                transition: transform 200ms ease-in-out
                &.expanded
                    transform: rotate(180deg)

        
</style>