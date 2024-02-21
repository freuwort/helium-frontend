<template>
    <Card is="button" type="button" class="media-item flex vertical">
        <Flex :padding=".5">
            <Flex class="aspect-ratio-1-1" x-align="center" y-align="center">
                <MediaIcon :mime="(item.mime_type as string)" />
            </Flex>
            <hr>
            <Flex padding="0 .5rem">
                <Flex horizontal>
                    <Flex class="flex-1">
                        <NuxtLink :to="`/d/files/${item.src_path}`">{{ item.name }}</NuxtLink>
                        <small>{{ humanFileSize(item.meta.size || 0) }}</small>
                    </Flex>
                    <VDropdown >
                        <IodIconButton type="button" variant="text" shape="pill" icon="more_vert" size="small"/>
                        <template #popper>
                            <ContextMenu class="min-w-15">
                                <ContextMenuItem is="a" icon="open_in_new" :href="(item.cdn_path as string)" target="_blank" rel="noopener noreferrer">In neuem Tab öffnen</ContextMenuItem>
                                <ContextMenuItem is="button" icon="info" @click="emits('view', item.src_path)">Eigenschaften</ContextMenuItem>
                                <ContextMenuItem is="button" icon="edit" @click="emits('rename', item.src_path)">Umbenennen</ContextMenuItem>
                                <ContextMenuItem is="button" icon="drive_file_move" @click="emits('move', item.src_path)">Verschieben</ContextMenuItem>
                                <ContextMenuItem is="button" icon="file_copy" @click="emits('copy', item.src_path)">Kopieren</ContextMenuItem>
                                <ContextMenuItem is="button" color="var(--color-error)" icon="delete" @click="emits('delete', item.src_path)">Löschen</ContextMenuItem>
                            </ContextMenu>
                        </template>
                    </VDropdown>
                </Flex>
            </Flex>
        </Flex>
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
        }
    })

    const emits = defineEmits(['view', 'delete', 'rename', 'move', 'copy'])

    const NuxtLink = defineNuxtLink({})
</script>

<style lang="sass" scoped>
    .media-item
        transition: box-shadow 100ms ease

        &:hover
            box-shadow: var(--shadow-elevation-medium)
</style>