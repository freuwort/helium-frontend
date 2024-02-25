<template>
    <Card
        is="button"
        type="button"
        class="media-item"
        :class="{ selected, ghost }"
        @dblclick="navigateTo(`/d/files/${item.src_path}`)"
    >
        <div class="media-preview">
            <div class="media-icon-wrapper">
                <MediaIcon :mime="(item.mime_type as string)" />
            </div>
        </div>
        <div class="media-info">
            <div class="inner">
                <NuxtLink class="row title" :to="`/d/files/${item.src_path}`">
                    <span v-tooltip="item.name">{{ item.name }}</span>
                </NuxtLink>
                <small class="row meta">
                    <span>{{ humanFileSize(item.meta.size || 0) }}</span>
                    <span v-if="item.meta.extension">{{ item.meta.extension }}</span>
                </small>
            </div>
            <div class="more-button-wrapper">
                <VDropdown placement="bottom-end">
                    <IodIconButton type="button" variant="text" shape="pill" icon="more_vert" size="small"/>
                    <template #popper>
                        <ContextMenu class="min-w-15">
                            <ContextMenuItem is="a" icon="open_in_new" :href="(item.cdn_path as string)" target="_blank" rel="noopener noreferrer">In neuem Tab öffnen</ContextMenuItem>
                            <ContextMenuItem is="button" v-close-popper icon="info" @click="emits('edit', item)">Eigenschaften</ContextMenuItem>
                            <ContextMenuItem is="button" v-close-popper icon="edit" @click="emits('rename', item)">Umbenennen</ContextMenuItem>
                            <ContextMenuItem is="button" v-close-popper icon="drive_file_move" @click="emits('move', item)">Verschieben</ContextMenuItem>
                            <ContextMenuItem is="button" v-close-popper icon="file_copy" @click="emits('copy', item)">Kopieren</ContextMenuItem>
                            <ContextMenuItem is="button" v-close-popper color="var(--color-error)" icon="delete" @click="emits('delete', item)">Löschen</ContextMenuItem>
                        </ContextMenu>
                    </template>
                </VDropdown>
            </div>
        </div>
    </Card>
</template>

<script lang="ts" setup>
    type Item = {
        id: number
        parent_id: number | null
        drive: string | null
        src_path: string
        thumbnail_path: string | null
        cdn_path: string | null
        mime_type: string | null
        name: string
        access: string | null
        meta: {
            size: number
            extension: string
        }
    }



    defineProps({
        item: {
            type: Object as PropType<Item>,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        },
        ghost: {
            type: Boolean,
            default: false
        }
    })

    const emits = defineEmits(['select', 'edit', 'rename', 'move', 'copy', 'delete'])

    const NuxtLink = defineNuxtLink({})
</script>

<style lang="sass" scoped>
    .media-item
        --local-border-color: var(--color-background-soft)

        position: relative
        display: flex
        flex-direction: column
        border-radius: var(--radius-xl)
        transition: box-shadow 100ms ease
        overflow: hidden
        border-color: var(--local-border-color)

        &::after
            content: ''
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            pointer-events: none
            background: var(--color-info)
            border-radius: inherit
            z-index: 0
            opacity: 0

        &.selected
            --local-border-color: var(--color-info)

            &::after
                opacity: .1

        &:hover
            box-shadow: var(--shadow-elevation-medium)

            .media-info
                .inner
                    mask-image: linear-gradient(to left, transparent 2rem, black 3rem)

                .more-button-wrapper
                    opacity: 1

        .media-preview
            position: relative
            z-index: 1
            padding: .5rem

            .media-icon-wrapper
                display: flex
                align-items: center
                justify-content: center
                width: 100%
                aspect-ratio: 1
                border-radius: var(--radius-m)

        .media-info
            position: relative
            z-index: 1
            display: flex
            flex-direction: column
            padding: .5rem 1rem
            border-top: 1px solid var(--local-border-color)

            .inner
                display: flex
                flex-direction: column

            .row
                display: flex
                align-items: center
                gap: .5rem
                overflow: hidden
                text-overflow: ellipsis
                white-space: nowrap

            .title
                font-weight: 500
                color: var(--color-text)
                display: block

            .more-button-wrapper
                position: absolute
                top: 0
                bottom: 0
                right: 0
                display: flex
                align-items: center
                padding-inline: .5rem
                opacity: 0
                transition: opacity 100ms ease

                .iod-button
                    --local-color-background: var(--color-text)
</style>