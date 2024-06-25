<template>
    <NuxtLayout name="auth-default" pageTitle="Dateien">
        <HeCard>
            <div class="header">
                <IodIconButton type="button" variant="text" corner="pill" icon="refresh" @click="fetch" v-tooltip="'Aktualisieren'"/>
                <MediaBreadcrumbs class="flex-1" :path="path" root-path="/d/media" @navigate="navigateTo($event)" @drop="onDrop($event.event, $event.path)">
                    <template #left>
                        <VDropdown placement="bottom">
                            <IodIconButton type="button" variant="text" corner="pill" icon="expand_more" size="s" v-tooltip="'Ordner auswählen'"/>
        
                            <template #popper>
                                <ContextMenu class="min-w-80">
                                    <ContextMenuItem :is="NuxtLink" to="/d/media/domain" show-chevron icon="home_storage">Hauptspeicher</ContextMenuItem>
                                    <ContextMenuItem :is="NuxtLink" to="/d/media/profiles" show-chevron icon="switch_account">Profil Dateien</ContextMenuItem>
                                    <ContextMenuItem :is="NuxtLink" to="/d/media/forms" show-chevron icon="edit_square">Formular Dateien</ContextMenuItem>
                                    <ContextMenuDivider />
                                    <ContextMenuItem icon="scan" v-close-popper @click="discover" >Ordner scannen</ContextMenuItem>
                                </ContextMenu>
                            </template>
                        </VDropdown>

                        <VDropdown placement="right">
                            <IodIconButton type="button" :variant="!!search ? 'filled' : 'text'" corner="pill" icon="search" size="s" v-tooltip="'Im Ordner suchen'" @dblclick="search = ''"/>
        
                            <template #popper>
                                <IodInput class="!bg-white" type="search" v-model="search" placeholder="Im Ordner suchen..."/>
                            </template>
                        </VDropdown>
                    </template>
                </MediaBreadcrumbs>
                <IodIconButton type="button" variant="text" corner="pill" icon="delete" v-tooltip="'Löschen'" :disabled="!selection.length" @click="deleteItems(selection)"/>
                <VDropdown placement="bottom-end">
                    <IodButton type="button" icon-right="add" label="Neu" corner="pill" size="m"/>
                    <template #popper>
                        <ContextMenu class="min-w-80">
                            <ContextMenuItem icon="upload" v-close-popper @click="uploadInput.click()">Hochladen</ContextMenuItem>
                            <ContextMenuItem icon="create_new_folder" v-close-popper @click="createDirectoryPopup.open(path)">Ordner erstellen</ContextMenuItem>
                        </ContextMenu>
                    </template>
                </VDropdown>

                <IodLoader type="bar" v-show="loading"/>
            </div>

            
            <div class="entity-grid" v-if="items.length">
                <MediaItem
                    class="!shadow-none"
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

            <IodAlert v-if="!items.length && !loading" class="h-72" as="placeholder">
                <div class="flex item-center justify-center h-16 w-16">
                    <IodIcon icon="home_storage" class="m-auto !text-5xl"/>
                </div>
                <span>Keine Dateien gefunden</span>
            </IodAlert>
            
            <IodAlert v-if="!items.length &&loading" class="h-72" as="placeholder">
                <div class="flex item-center justify-center h-16 w-16">
                    <IodLoader class="m-auto"/>
                </div>
                <span>Lade Dateien</span>
            </IodAlert>

            <div class="footer">
                <IodPagination v-model="pagination"/>
                <HeSpacer />
                <IodSelect class="!h-10 !rounded-full" v-tooltip="'Einträge pro Seite'" :modelValue="pagination.size" @update:modelValue="setPagination({ size: parseInt($event) })" :options="[
                    { value: 10, text: '10 pro Seite' },
                    { value: 20, text: '20 pro Seite' },
                    { value: 50, text: '50 pro Seite' },
                    { value: 100, text: '100 pro Seite' },
                    { value: 250, text: '250 pro Seite' },
                    { value: 100000000, text: 'Alle' },
                ]"/>
            </div>
        </HeCard>

        
        
        <input class="hidden" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
        
        <MediaUploadCard />
        <DialogMediaCreateDirectory ref="createDirectoryPopup" placement="center" max-width="500px" blur="0" @saved="fetch()"/>
        <DialogMediaRename ref="renamePopup" placement="center" max-width="500px" blur="0" @saved="fetch(); deselectAll()" />
        <DialogMediaShare ref="sharePopup" placement="center" max-width="500px" blur="0" @saved="fetch()"/>
        <DialogMediaProperties ref="propertyPopup" placement="right" max-width="500px" blur="0" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'
    import type { Pagination } from '~/types/general'
    import { throttle } from 'lodash'



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
        catch (error)
        {}

        loading.value = false
    }
    const throttledFetch = throttle(fetch, 300)

    function setPagination(value: Partial<Pagination>) {
        pagination.value = { ...pagination.value, ...value }
    }

    watch(() => [path, search, pagination.value.size, pagination.value.page], throttledFetch, { deep: true })
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
        const { data } = await useAxios().delete(`/api/media/`, { data: { paths } })

        fetch()
        deselectAll()
    }
    // END: Delete



    // START: Discovery
    function discover() {
        useAxios().patch('/api/media/discovery', { path: path.value })
    }
    // END: Discovery



    // START: Keybinds
    useHotkeys('alt+n', () => { createDirectoryPopup.value.open(path.value) }, { prevent: true })
    useHotkeys('alt+u', () => { uploadInput.value.click() }, { prevent: true })
    useHotkeys('del', () => { deleteItems(selection.value) }, { prevent: true })
    // END: Keybinds
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
        gap: 1rem
        padding: 1rem



    .header
        position: relative
        padding: 1rem
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

    .footer
        position: relative
        padding: 1rem
        z-index: 100
        display: flex
        align-items: center
        gap: .5rem
        border-top: 1px solid var(--color-border)
</style>
