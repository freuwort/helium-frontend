<template>
    <NuxtLayout name="auth-default" :scope pageTitle="Dateien">
        <HeCard>
            <div class="header">
                <IodInput class="search-input" icon-left="search" placeholder="Suchen" v-model="search"/>

                <MediaBreadcrumbs class="flex-1" :path="path" root-path="/media" @navigate="navigateTo($event)" @drop="onDrop($event.event, $event.path)" />
                
                <div class="flex items-center p-1 gap-1 bg-background-soft rounded-full">
                    <VDropdown placement="bottom">
                        <IodButton type="button" class="!gap-2 !px-4" size="s" corner="pill" variant="text" label="Aktionen" icon-right="arrow_drop_down" normal-case/>
    
                        <template #popper>
                            <ContextMenu class="min-w-72">
                                <ContextMenuItem is="button" icon="refresh" v-close-popper @click="fetch">Ordner Aktualisieren</ContextMenuItem>
                                <ContextMenuItem is="button" icon="scan" v-close-popper @click="discover">Ordner Scannen</ContextMenuItem>
                                <ContextMenuDivider />
                                <ContextMenuLabel :label="`Auswahl – ${ selection.length }`"/>
                                <ContextMenuItem is="button" icon="deselect" v-close-popper @click="deselectAll" :disabled="!selection.length">Auswahl abwählen</ContextMenuItem>
                                <ContextMenuItem is="button" icon="delete" v-close-popper color="var(--color-error)" :disabled="!selection.length" @click="deleteItems(selection)">Auswahl löschen</ContextMenuItem>
                            </ContextMenu>
                        </template>
                    </VDropdown>
                </div>

                <VDropdown placement="bottom-end">
                    <IodButton type="button" icon-right="add" label="Neu" corner="pill" size="m"/>
                    <template #popper>
                        <ContextMenu class="min-w-80">
                            <ContextMenuItem is="button" v-close-popper icon="upload" @click="uploadInput.click()">Hochladen</ContextMenuItem>
                            <ContextMenuItem is="button" v-close-popper icon="create_new_folder" @click="createDirectoryPopup.open(path)">Ordner erstellen</ContextMenuItem>
                        </ContextMenu>
                    </template>
                </VDropdown>

                <IodLoader type="bar" v-show="loading"/>
            </div>

            
            <MediaDropzone @drop.stop="onDrop($event, path)" :accept="['Files']">
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
    
                <IodAlert type="placeholder" class="h-72 pointer-events-none" v-if="!items.length && !loading">
                    <div class="flex item-center justify-center h-16 w-16 mx-auto">
                        <IodIcon icon="home_storage" class="!text-5xl"/>
                    </div>
                    Keine Dateien gefunden
                </IodAlert>
                
                <IodAlert type="placeholder" class="h-72 pointer-events-none" v-if="!items.length &&loading">
                    <div class="flex item-center justify-center h-16 w-16 mx-auto">
                        <IodLoader class="m-auto"/>
                    </div>
                    Lade Dateien
                </IodAlert>
            </MediaDropzone>

            <div class="footer">
                <IodPagination v-model="pagination"/>
                <HeSpacer />
                <div class="flex items-center p-1 gap-1 bg-background-soft rounded-full">
                    <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'10 Einträge pro Seite'" :variant="pagination.size === 10 ? 'contained' : 'text'" label="10" @click="setPagination({ size: 10 })"/>
                    <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'20 Einträge pro Seite'" :variant="pagination.size === 20 ? 'contained' : 'text'" label="20" @click="setPagination({ size: 20 })"/>
                    <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'50 Einträge pro Seite'" :variant="pagination.size === 50 ? 'contained' : 'text'" label="50" @click="setPagination({ size: 50 })"/>
                    <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'100 Einträge pro Seite'" :variant="pagination.size === 100 ? 'contained' : 'text'" label="100" @click="setPagination({ size: 100 })"/>
                    <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'250 Einträge pro Seite'" :variant="pagination.size === 250 ? 'contained' : 'text'" label="250" @click="setPagination({ size: 250 })"/>
                </div>
            </div>
        </HeCard>

        
        
        <input class="hidden" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
        
        <DialogMediaCreateDirectory ref="createDirectoryPopup" placement="center" max-width="500px" blur="0" @saved="fetch()"/>
        <DialogMediaRename ref="renamePopup" placement="center" max-width="500px" blur="0" @saved="fetch(); deselectAll()" />
        <DialogMediaShare ref="sharePopup" placement="center" max-width="500px" blur="0" @saved="fetch()"/>
        <DialogMediaProperties ref="propertyPopup" placement="right" max-width="500px" blur="0" />
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
    // END: Dialogs



    // START: Fetch
    const loading = ref(false)
    const path = computed(() => (route.params.path as string[] || ['domain']).filter(e => e).join('/'))
    const items = ref<MediaItem[]>([])

    const layout = ref('grid')
    const search = ref('')
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

    watch(() => [path, search, pagination.value.size, pagination.value.page], throttledFetch, { deep: true })
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
        if (event.ctrlKey) {
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
    .header
        position: sticky
        top: 4rem
        padding: 1rem
        z-index: 100
        display: flex
        align-items: center
        gap: 1rem
        border-bottom: 1px solid var(--color-border)
        background: var(--color-background)
        border-top-left-radius: var(--radius-l)
        border-top-right-radius: var(--radius-l)

        .iod-loader
            position: absolute
            left: 0
            right: 0
            bottom: -1px
            height: 2px !important

        .search-input
            width: 16rem
            height: 2.5rem !important
            border-radius: 5rem !important
            --local-padding: .25rem

    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
        gap: 1rem
        padding: 1rem

    .footer
        position: relative
        padding: 1rem
        z-index: 100
        display: flex
        align-items: center
        gap: .5rem
        border-top: 1px solid var(--color-border)

        .size-fixture
            display: flex
            align-items: center
            gap: .25rem
            padding: .25rem
            height: 2.5rem
            border-radius: 2.5rem
            background: var(--color-background-soft)
</style>
