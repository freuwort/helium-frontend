<template>
    <NuxtLayout name="auth-default" :scope pageTitle="Dateien">
        <div class="p-4 w-full h-full flex flex-col">
            <div class="flex flex-col pb-4">
                <div class="flex items-center gap-2">
                    <IodInput class="search-input" icon-left="search" placeholder="Suchen" v-model="search"/>
                    
                    <IodIconButton type="button" size="s" corner="m" variant="contained" icon="refresh" v-tooltip="'Ordner Aktualisieren'" @click="fetch" />
                    <IodIconButton type="button" size="s" corner="m" variant="contained" icon="scan" v-tooltip="'Ordner Scannen'" @click="discover" />
        
                    <HeDivider vertical class="h-6" />
        
                    <IodIconButton type="button" size="s" corner="m" variant="contained" icon="deselect" v-tooltip="'Auswahl Abwählen'" @click="deselectAll" :disabled="!selection.length" />
                    <IodIconButton type="button" size="s" corner="m" variant="contained" icon="delete" v-tooltip="'Auswahl Löschen'" @click="deleteItems(selection)" :disabled="!selection.length" color-preset="error" />
        
                    <HeSpacer />
                    
                    <VDropdown placement="bottom-end">
                        <IodButton type="button" icon-right="add" label="Neu" corner="m" size="s"/>
                        <template #popper>
                            <ContextMenu class="min-w-80">
                                <ContextMenuItem is="button" v-close-popper icon="upload" @click="uploadInput.click()">Hochladen</ContextMenuItem>
                                <ContextMenuItem is="button" v-close-popper icon="create_new_folder" @click="createDirectoryPopup.open(path)">Ordner erstellen</ContextMenuItem>
                            </ContextMenu>
                        </template>
                    </VDropdown>
        
                    <IodIconButton type="button" icon="tune" v-tooltip="'Anzeige Optionen'" size="s" variant="contained" @click="displayOptions.open()"/>
        
                    <IodLoader type="bar" v-show="loading"/>
                </div>

                <div class="flex items-center gap-2 mt-4">
                    <MediaBreadcrumbs class="flex-1" :path="path" root-path="/media" @navigate="navigateTo($event)" @drop="onDrop($event.event, $event.path)" />
                </div>
            </div>

            
            <MediaDropzone class="flex-1 overflow-y-auto small-scrollbar" @drop.stop="onDrop($event, path)" :accept="['Files']">
                <div class="entity-grid" v-if="items.length">
                    <MediaDropzone class="rounded-lg" v-for="item in items" :key="item.id" :enabled="!(dragging && selection.includes(item.src_path)) && item.mime_type === 'directory'" @dragover.stop @drop.stop="onDrop($event, item.src_path)">
                        <MediaItem
                            :item="item"
                            :selection="selection"
                            :dragging="dragging"
                            show-context-menu
                            draggable="true"
                            @dragstart="onDragStart($event, item)"
                            @click="select($event, item.src_path)"
                            @dblclick="navigateOrOpen(item)"
                            @edit="propertyPopup.open(item)"
                            @share="sharePopup.open(item)"
                            @rename="renamePopup.open(item)"
                            @keyup.enter.exact="navigateOrOpen(item)"
                            @keyup.enter.ctrl.exact="renamePopup.open(item)"
                            @keyup.enter.shift.exact="sharePopup.open(item)"
                            @delete="deleteItems([item.src_path])"
                        />
                    </MediaDropzone>
                </div>
    
                <IodAlert type="placeholder" class="h-48 pointer-events-none" v-if="!items.length && !loading">
                    <div class="flex items-center justify-center h-16 w-16 mx-auto">
                        <IodIcon icon="home_storage" class="!text-5xl"/>
                    </div>
                    Keine Dateien gefunden
                </IodAlert>
                
                <IodAlert type="placeholder" class="h-48 pointer-events-none" v-if="!items.length && loading">
                    <div class="flex items-center justify-center h-16 w-16 mx-auto">
                        <IodLoader class="m-auto"/>
                    </div>
                    Lade Dateien
                </IodAlert>
            </MediaDropzone>

            <div class="flex items-center pt-4">
                <IodPagination v-model="pagination"/>
                <HeSpacer />
            </div>
        </div>

        
        
        <input class="hidden" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
        
        <DialogMediaCreateDirectory ref="createDirectoryPopup" placement="center" @saved="fetch()"/>
        <DialogMediaRename ref="renamePopup" placement="center" @saved="fetch(); deselectAll()" />
        <DialogMediaShare ref="sharePopup" placement="center" @saved="fetch()"/>
        <DialogMediaProperties ref="propertyPopup" placement="right" />

        <IodPopup ref="displayOptions" title="Anzeige Optionen" placement="right">
            <div class="flex flex-col p-4 pt-0 gap-4">
                <ContextMenu class="bg-background rounded-lg">
                    <ContextMenuLabel label="Einträge pro Seite" />
                    <ContextMenuItem
                        v-for="size in paginationSizes"
                        :key="size"
                        is="button"
                        type="button"
                        :label="`${size} Einträge pro Seite`"
                        :icon="pagination.size === size ? 'radio_button_checked' : 'radio_button_unchecked'"
                        :active="pagination.size === size"
                        @click="setPagination({ size })"
                    />
                </ContextMenu>
            </div>
        </IodPopup>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'
    import type { Pagination } from '~/types/general'
    import _ from 'lodash'
    
    const route = useRoute()
    const uploadManager = useUploadStore()
    const scope = 'view_admin_media_index'



    // START: Dialogs
    const createDirectoryPopup = ref()
    const renamePopup = ref()
    const propertyPopup = ref()
    const sharePopup = ref()
    const displayOptions = ref()
    // END: Dialogs



    // START: Fetch
    const loading = ref(false)
    const path = computed(() => (route.params.path as string[] || ['domain']).filter(e => e).join('/'))
    const items = ref<MediaItem[]>([])

    const layout = ref('grid')
    const search = ref('')
    const paginationSizes = [10, 20, 50, 100, 250]
    const pagination = ref({
        size: 20,
        from: 0,
        to: 0,
        page: 1,
        lastPage: 1,
        total: 0,
    })

    async function fetch() {
        loading.value = true

        try {
            const {data} = await useAxios().get(apiRoute('/media/:path', {
                path: path.value,
                size: pagination.value.size,
                page: pagination.value.page,
                filter_search: search.value,
            }))

            pagination.value.size = data.meta.per_page
            pagination.value.from = data.meta.from
            pagination.value.to = data.meta.to
            pagination.value.page = data.meta.current_page
            pagination.value.lastPage = data.meta.last_page
            pagination.value.total = data.meta.total
    
            items.value = data.data
        }
        catch (error) {}

        loading.value = false
    }
    const throttledFetch = _.throttle(fetch, 300)

    function setPagination(value: Partial<Pagination>) {
        pagination.value = { ...pagination.value, ...value }
    }

    watch(() => [path, search, pagination.value.size, pagination.value.page], throttledFetch, { immediate: true, deep: true })
    // END: Fetch



    // START: Misc
    function navigateOrOpen(item: MediaItem) {
        if (item.mime_type === 'directory') {
            return navigateTo(`/media/${item.src_path}`)
        }

        propertyPopup.value.open(item)
    }



    // START: Selection
    const selection = ref<string[]>([])

    function select(event: MouseEvent, path: string)
    {
        if (event.ctrlKey || event.metaKey) {
            if (selection.value.includes(path)) {
                selection.value = selection.value.filter(p => p !== path)
            }
            else {
                selection.value.push(path)
            }
        }
        else if (event.shiftKey) {
            const index = items.value.findIndex(i => i.src_path === path)
            const start = items.value.findIndex(i => i.src_path === selection.value[0])
            const end = index

            const range = start < end
                ? items.value.slice(start, end + 1)
                : items.value.slice(end, start + 1)

            selection.value = range.map(i => i.src_path)
        }
        else {
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
        if (!selection.value.includes(item.src_path)) {
            selection.value = [item.src_path]
        }

        if (!event.dataTransfer) {
            return
        }

        event.dataTransfer.setData('text/plain', selection.value
            .map((p: string) => encodeURIComponent(p))
            .join(','))

        dragging.value = true
    }

    function onDragStop(event: DragEvent) {
        dragging.value = false
    }

    function onDrop(event: DragEvent, path: string) {
        event.preventDefault()

        dragging.value = false

        if (!event.dataTransfer) {
            return
        }

        if (event.dataTransfer.files.length) {
            upload(event.dataTransfer.files, path)
            return
        }

        let data = event.dataTransfer
            .getData('text/plain')
            .split(',')
            .map((p: string) => decodeURIComponent(p))

        if (event.ctrlKey) {
            copy(data, path)
            return
        }

        move(data, path)
    }

    onMounted(() => {
        window.addEventListener('dragend', onDragStop)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('dragend', onDragStop)
    })
    // END: Drag & Drop



    // START: Upload
    const uploadInput = ref()

    async function upload(files: any, path_: string = path.value) {
        // Check if files are available
        if (!files.length) return

        // Upload files
        await uploadManager.upload(path_, files)

        // Reset input
        if (uploadInput.value) uploadInput.value.value = ''
        
        // Fetch items
        fetch()
    }
    // END: Upload



    // START: Move
    function move(paths: string[], destination: string) {
        useForm({
            paths,
            destination,
        })
        .patch('/api/media/move', {
            onSuccess() { fetch(); deselectAll() },
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
            onSuccess() { fetch(); deselectAll() },
            onError(errors: any) { console.log(errors.data) }
        })
    }
    // END: Copy



    // START: Delete
    async function deleteItems(paths: string[]) {
        const { data } = await useAxios().delete(`/api/media`, { data: { paths } })

        fetch()
        deselectAll()
    }
    // END: Delete



    // START: Discovery
    function discover() {
        useAxios().patch('/api/media/repair', { action: 'discover', path: path.value })
    }
    // END: Discovery



    // START: Keybinds
    useHotkeys('alt+n', () => { createDirectoryPopup.value.open(path.value) }, { prevent: true })
    useHotkeys('alt+u', () => { uploadInput.value.click() }, { prevent: true })
    // useHotkeys('del', () => { deleteItems(selection.value) }, { prevent: true })
    // END: Keybinds
</script>

<style lang="sass" scoped>
    .iod-loader
        position: absolute
        left: 0
        right: 0
        bottom: -1px
        height: 2px !important

    .search-input
        width: 16rem
        height: 2rem !important
        --local-padding: .25rem

    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
        gap: .5rem
</style>
