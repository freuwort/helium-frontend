<template>
    <div class="upload-card" key="card">
        <template v-if="uploadManager.uploads.length">
            <TransitionGroup name="fade">
                <div class="header" key="header">
                    <span class="flex-1">{{ uploadManager.statusText || 'Keine Uploads' }} </span>
                    <IodIconButton type="button" variant="text" corner="pill" size="s" icon="cancel" @click="uploadManager.clearAll()" />
                </div>
    
                <ContextMenuDivider class="!my-2"/>
    
                <div class="content small-scrollbar" key="content">
                    <TransitionGroup name="fade">
                        <div class="upload" v-for="upload in uploadManager.uploads" :key="upload.id" :data-status="upload.status">
                            <span class="flex-1">{{ upload.name }} ({{ upload.progress }}%)</span>
                            <div class="h-9 w-9 flex items-center justify-center relative">
                                <IodIconButton type="button" class="relative z-10" variant="text" corner="pill" size="s" icon="close" @click="uploadManager.cancel(upload.id)" />
                                <IodProgress class="absolute pointer-events-none" :thickness="3" v-show="upload.status === 'uploading'" :progress="upload.progress"/>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </TransitionGroup>
        </template>
        <IodAlert type="placeholder" class="h-20" text="Keine Uploads" v-else/>
    </div>
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



    .upload-card
        padding-block: .5rem
        display: flex
        flex-direction: column
        width: 100%
        user-select: none
        transition: all 200ms ease-in-out

        .header
            display: flex
            font-weight: 500
            align-items: center
            color: var(--color-text)
            height: 3rem
            padding-inline: 1rem .5rem !important

            .iod-button
                transition: transform 200ms ease-in-out

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
            height: 3rem
            width: 100%
            color: var(--color-text)
            position: relative
            overflow: hidden

            &:hover
                background: var(--color-background-soft)

            &[data-status="uploading"]
                color: var(--color-info)

            &[data-status="completed"]
                color: var(--color-success)

            &[data-status="cancelled"]
                color: var(--color-error)

            .iod-button
                --local-color-background: currentColor
</style>