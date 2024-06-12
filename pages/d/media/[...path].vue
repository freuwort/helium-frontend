<template>
    <NuxtLayout name="auth-sidebar" pageTitle="Dateien">
        <template #sidebar>
            <HeFlex class="w-80 h-full">
                <HeFlex class="border-b" :padding="1" :gap=".5" align-x="flex-start">
                    <VDropdown placement="bottom-end">
                        <IodButton type="button" icon-left="add" label="Neu" corner="pill" size="m"/>
                        <template #popper>
                            <ContextMenu class="min-w-80">
                                <ContextMenuItem icon="upload" v-close-popper @click="uploadInput?.click()">Hochladen</ContextMenuItem>
                                <ContextMenuItem icon="create_new_folder" v-close-popper @click="createDirectoryPopup.open(path)">Ordner erstellen</ContextMenuItem>
                            </ContextMenu>
                        </template>
                    </VDropdown>
                </HeFlex>
                <ContextMenu>
                    <ContextMenuItem :is="NuxtLink" to="/d/media/domain" icon="domain">Domain Speicher</ContextMenuItem>
                    <ContextMenuItem :is="NuxtLink" to="/d/media/profiles" icon="groups">Profil-Medien</ContextMenuItem>
                    <ContextMenuItem :is="NuxtLink" to="/d/media/forms" icon="cloud_upload">Formular Daten</ContextMenuItem>
                </ContextMenu>
                <HeSpacer />
                <HeFlex class="border-t" :padding="1" :gap=".5" horizontal>
                    <IodIconButton type="button" variant="text" corner="pill" icon="scan" @click="discover" background="var(--color-text-soft)" v-tooltip="'Verzeichnisse scannen'"/>
                    <IodIconButton type="button" variant="text" corner="pill" icon="refresh" @click="fetchItems" background="var(--color-text-soft)" v-tooltip="'Aktualisieren'"/>
                    <HeSpacer />
                </HeFlex>
            </HeFlex>
        </template>

        <HeFlex gap="1rem">
            <div class="selection-bar">
                <MediaBreadcrumbs :path="path" root-path="/d/media" @navigate="navigateTo($event)" @drop="onDrop($event.event, $event.path)"/>
                <HeSpacer />
                <IodIconButton type="button" corner="pill" variant="text" size="s" icon="delete" v-tooltip="'Löschen'" :disabled="!selection.length" @click="deleteItems(selection)"/>
                <IodLoader type="bar" v-show="loading"/>
            </div>

            
            <div class="entity-grid" v-if="items.length">
                <MediaItem
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    :selected="selection.includes(item.src_path)"
                    :dragging="dragging"
                    :draggable="true"
                    show-context-menu
                    @dragstart="onDragStart($event, item)"
                    @drop="onDrop($event, item.src_path)"
                    @click="select($event, item.src_path)"
                    @dblclick="item.mime_type === 'directory' ? navigateTo(`/d/media/${item.src_path}`) : propertyPopup.open(item)"
                    @edit="propertyPopup.open(item)"
                    @share="sharePopup.open(item)"
                    @rename="renamePopup.open(item)"
                    @delete="deleteItems([item.src_path])"
                />
            </div>

            <IodAlert v-if="!items.length && !loading" class="h-80" as="placeholder">Keine Dateien vorhanden</IodAlert>
        </HeFlex>

        
        
        <input class="hidden" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
        
        <MediaUploadCard />
        <DialogMediaCreateDirectory ref="createDirectoryPopup" placement="center" max-width="500px" blur="0" @saved="fetchItems()"/>
        <DialogMediaRename ref="renamePopup" placement="center" max-width="500px" blur="0" @saved="fetchItems(); deselectAll()" />
        <DialogMediaShare ref="sharePopup" placement="center" max-width="500px" blur="0" @saved="fetchItems()"/>
        <DialogMediaProperties ref="propertyPopup" placement="right" max-width="500px" blur="0" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'



    definePageMeta({
        middleware: 'auth',
    })

    const route = useRoute()
    const uploadManager = useUploadStore()
    const NuxtLink = defineNuxtLink({})



    // START: Dialogs
    const createDirectoryPopup = ref()
    const renamePopup = ref()
    const propertyPopup = ref()
    const sharePopup = ref()
    // END: Dialogs



    // START: Fetch
    const path = computed(() => (route.params.path as string[] || ['domain']).filter(e => e).join('/'))
    const items = ref<MediaItem[]>([])
    const loading = ref(false)

    async function fetchItems() {
        loading.value = true
        const { data } = await useAxios().get(`/api/media/${path.value}`)
        loading.value = false

        items.value = data.data
    }

    watch(path, fetchItems, { immediate: true })
    // END: Fetch



    // START: Selection
    const selection = ref<string[]>([])

    function select(event: MouseEvent, path: string)
    {
        if (event.ctrlKey)
        {
            if (selection.value.includes(path))
            {
                selection.value = selection.value.filter(p => p !== path)
            }
            else
            {
                selection.value.push(path)
            }
        }
        else if (event.shiftKey)
        {
            const index = items.value.findIndex(i => i.src_path === path)
            const start = items.value.findIndex(i => i.src_path === selection.value[0])
            const end = index

            const range = start < end
                ? items.value.slice(start, end + 1)
                : items.value.slice(end, start + 1)

            selection.value = range.map(i => i.src_path)
        }
        else
        {
            selection.value = [path]
        }
    }

    function deselectAll()
    {
        selection.value = []
    }
    // END: Selection



    // START: Drag & Drop
    const dragging = ref(false)

    function onDragStart(event: DragEvent, item: MediaItem) {
        if (!selection.value.includes(item.src_path))
        {
            selection.value = [item.src_path]
        }
        
        dragging.value = true
    }

    function onDragEnd(event: DragEvent) {
        dragging.value = false
    }

    function onDrop(event: DragEvent, path: string) {
        dragging.value = false

        event.ctrlKey ? copy(selection.value, path) : move(selection.value, path)
    }

    onMounted(() => {
        window.addEventListener('dragend', onDragEnd)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('dragend', onDragEnd)
    })
    // END: Drag & Drop



    // START: Upload
    const uploadInput = ref()

    async function upload(files: any) {
        // Check if files are available
        if (!files.length) return

        // Upload files
        await uploadManager.upload(path.value, files)

        // Reset input
        if (uploadInput.value) uploadInput.value.value = ''
        
        // Fetch items
        fetchItems()
    }
    // END: Upload



    // START: Move
    function move(paths: string[], destination: string) {
        useForm({
            paths,
            destination,
        })
        .patch('/api/media/move', {
            onSuccess() { fetchItems(); deselectAll() },
            onError(errors: any) { console.log(errors.data) }
        })
    }
    // END: Move



    // START: Copy
    function copy(paths: string[], destination: string) {
        useForm({
            paths,
            destination,
        })
        .post('/api/media/copy', {
            onSuccess() { fetchItems(); deselectAll() },
            onError(errors: any) { console.log(errors.data) }
        })
    }
    // END: Copy



    // START: Delete
    async function deleteItems(paths: string[]) {
        const { data } = await useAxios().delete(`/api/media/`, { data: { paths } })

        fetchItems()
        deselectAll()
    }
    // END: Delete



    // START: Discovery
    function discover() {
        useAxios().patch('/api/media/discovery', { path: path.value })
    }
    // END: Discovery
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
        gap: 1rem



    .selection-bar
        position: relative
        margin-top: 1rem
        padding-bottom: 1rem
        z-index: 100
        display: flex
        align-items: center
        gap: .5rem
        border-bottom: 1px solid var(--color-border)

        .iod-loader
            position: absolute
            left: 0
            right: 0
            bottom: -1px
            height: 2px !important
</style>
