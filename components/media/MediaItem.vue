<template>
    <Card
        is="div"
        :class="['media-item', { selected, ghost, disabled, dragging, dragover: dragOver }]"
        @dragover.prevent="onDraggingOver"
        @dragstart="onStartDraggingOver"
        @dragend="onStopDraggingOver"
        @dragleave="onStopDraggingOver"
        @drop.prevent="onDrop"
    >
        <div class="media-preview">
            <div class="media-icon-wrapper">
                <MediaIcon :mime="(item.mime_type as string)" />
            </div>
        </div>
        <div class="media-info">
            <div class="inner">
                <NuxtLink v-if="isFolder" class="row title" :to="`/d/files/${item.src_path}`">
                    <span v-tooltip="item.name">{{ item.name }}</span>
                    <IodProfileArray class="profiles" :data="profiles" />
                </NuxtLink>
                <a v-else class="row title" href="#" @click.prevent="emits('edit', item)">
                    <span v-tooltip="item.name">{{ item.name }}</span>
                    <IodProfileArray class="profiles" :data="profiles" />
                </a>
            </div>
            <div class="more-button-wrapper">
                <VDropdown placement="bottom-end">
                    <IodIconButton type="button" variant="text" corner="pill" icon="more_vert" size="s"/>
                    <template #popper>
                        <ContextMenu class="min-w-15">
                            <ContextMenuItem is="a" icon="download" :href="(item.cdn_path as string)" target="_blank" download rel="noopener noreferrer">Herunterladen</ContextMenuItem>
                            <ContextMenuItem is="a" icon="open_in_new" :href="(item.cdn_path as string)" target="_blank" rel="noopener noreferrer">In neuem Tab öffnen</ContextMenuItem>
                            <ContextMenuDivider />
                            <ContextMenuItem is="button" v-close-popper icon="info" @click="emits('edit', item)">Eigenschaften</ContextMenuItem>
                            <ContextMenuItem is="button" v-close-popper icon="edit" @click="emits('rename', item)">Umbenennen</ContextMenuItem>
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
        users: {
            id: number
            name: string
            profile_image: string
        }[]
        access: string | null
        meta: {
            size: number
            extension: string
        }
    }



    const props = defineProps({
        item: {
            type: Object as PropType<Item>,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        dragging: {
            type: Boolean,
            default: false
        },
    })

    const dragOver = ref(false)
    const isFolder = computed(() => props.item.mime_type === 'folder')

    // Ghost items are items that are not selectable, draggable or dropable
    const ghost = computed(() => {
        // @case: disabled
        if (props.disabled) return true

        // @case: selected and dragging
        if (props.selected && props.dragging) return true

        // @case: dragging and not a folder
        if (props.dragging && !isFolder.value) return true

        // @case: not ghost
        return false
    })

    const profiles = computed(() => props.item.users.map((user) => ({ label: user.name, image: user.profile_image })))



    function onStartDraggingOver()
    {
        dragOver.value = false
    }

    function onDraggingOver()
    {
        dragOver.value = true
    }

    function onStopDraggingOver()
    {
        dragOver.value = false
    }

    function onDrop(event: DragEvent)
    {
        dragOver.value = false

        if (ghost.value)
        {
            event.stopPropagation()
            return
        }

        emits('drop', event)
    }



    const emits = defineEmits(['select', 'download', 'edit', 'rename', 'drop', 'delete'])
</script>

<style lang="sass" scoped>
    .media-item
        --local-border-color: var(--color-background-soft)

        position: relative
        display: flex
        flex-direction: column
        border-radius: var(--radius-xl)
        transition: all 50ms ease
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
            transition: opacity 50ms ease

        &.ghost
            opacity: .5

        &.selected:not(.ghost),
        &.dragover:not(.ghost)
            --local-border-color: var(--color-info)

            &::after
                opacity: .1

        &:hover:not(.ghost)
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
            padding: 1rem
            border-top: 1px solid var(--local-border-color)
            transition: all 50ms ease

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

            .profiles
                height: 2rem
                padding: .25rem 0

            .title
                font-weight: 500
                color: var(--color-text)

                span
                    flex: 1

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