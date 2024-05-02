<template>
    <NuxtLayout limiter="normal" name="auth-sidebar" pageTitle="Dateien">
        <template #sidebar>
            <Flex class="w-21 h-100p">
                <Flex class="border-bottom" :padding="1" :gap=".5" x-align="flex-start">
                    <VDropdown placement="bottom-end">
                        <IodButton type="button" icon-left="add" label="Neu" corner="pill" size="m"/>
                        <template #popper>
                            <ContextMenu class="min-w-19">
                                <ContextMenuItem icon="upload" v-close-popper @click="uploadInput?.click()">Hochladen</ContextMenuItem>
                                <ContextMenuItem icon="create_new_folder" v-close-popper @click="openCreateFolderPopup">Ordner erstellen</ContextMenuItem>
                            </ContextMenu>
                        </template>
                    </VDropdown>
                </Flex>
                <ContextMenu>
                    <ContextMenuItem :is="NuxtLink" to="/d/files/public" icon="public">Öffentliche Ablage</ContextMenuItem>
                    <ContextMenuItem :is="NuxtLink" to="/d/files/private" icon="lock">Geschützte Ablage</ContextMenuItem>
                    <ContextMenuItem :is="NuxtLink" to="/d/files/profile_pictures" icon="account_circle">Profilbilder</ContextMenuItem>
                    <ContextMenuItem :is="NuxtLink" to="/d/files/profile_banners" icon="landscape">Profilbanner</ContextMenuItem>
                </ContextMenu>
                <Spacer />
                <Flex class="sidebar-icons border-top" :padding="1" :gap=".5" horizontal>
                    <VDropdown placement="top-end">
                        <IodIconButton type="button" variant="text" corner="pill" icon="settings" v-tooltip="'Einstellungen'"/>
                        <template #popper>
                            <ContextMenu class="min-w-19">
                                <ContextMenuItem icon="scan" @click="discover">Verzeichnisse scannen</ContextMenuItem>
                                <ContextMenuItem icon="refresh" @click="fetchItems">Aktualisieren</ContextMenuItem>
                                <ContextMenuDivider />
                                <ContextMenuItem icon="settings">Einstellungen</ContextMenuItem>
                            </ContextMenu>
                        </template>
                    </VDropdown>
                    <Spacer />
                </Flex>
            </Flex>
        </template>

        <Flex :gap="1">
            <div class="selection-bar">
                <MediaBreadcrumbs :path="path" root-path="/d/files" @drop="onDrop($event.event, $event.path)"/>
                <Spacer />
                <IodIconButton type="button" corner="pill" variant="text" size="s" icon="delete" v-tooltip="'Löschen'" :disabled="!selection.length" @click="deleteItems(selection)"/>
            </div>
            
            <div class="entity-grid" v-if="items.length">
                <MediaItem
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                    :selected="selection.includes(item.src_path)"
                    :dragging="dragging"
                    :draggable="true"
                    @dragstart="onDragStart($event, item)"
                    @drop="onDrop($event, item.src_path)"
                    @click="select($event, item.src_path)"
                    @dblclick="item.mime_type === 'folder' ? navigateTo(`/d/files/${item.src_path}`) : openPropertyPopup(item)"
                    @edit="openPropertyPopup"
                    @rename="openRenamePopup"
                    @delete="deleteItems([item.src_path])"
                />
            </div>

            <IodAlert v-else class="h-20" as="placeholder">Keine Dateien vorhanden</IodAlert>
        </Flex>
        


        <MediaUploadCard />
        <input class="display-none" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
        
        <IodPopup ref="createFolderPopup" title="Ordner erstellen" max-width="450px">
            <Flex is="form" :padding="1" :gap="1" @submit.prevent="createFolder">
                <ErrorAlert :errors="createFolderForm.errors" />

                <IodInput label="Name" ref="createFolderInput" v-model="createFolderForm.name" />
                <Flex horizontal>
                    <IodButton type="button" variant="contained" label="Abbrechen" @click="closeCreateFolderPopup" :loading="createFolderForm.processing" />
                    <Spacer />
                    <IodButton type="submit" variant="filled" label="Ordner Erstellen" :loading="createFolderForm.processing" />
                </Flex>
            </Flex>
        </IodPopup>

        <IodPopup ref="renamePopup" title="Umbenennen" max-width="450px">
            <Flex is="form" :padding="2" :gap="2" @submit.prevent="rename">
                <IodInput label="Name" ref="renameInput" v-model="renameForm.name" />
                <Flex horizontal>
                    <IodButton type="button" variant="contained" label="Abbrechen" @click="closeRenamePopup" :loading="renameForm.processing" />
                    <Spacer />
                    <IodButton type="submit" variant="filled" label="Umbenennen" :loading="renameForm.processing" />
                </Flex>
            </Flex>
        </IodPopup>

        <IodPopup ref="propertyPopup" title="Eigenschaften" placement="right" max-width="500px" blur="0" should-close-on-backdrop-click>
            <template v-if="propertyForm.id">
                <Flex class="background-soft aspect-ratio-16-9" x-align="center">
                    <MediaIcon :mime="(propertyForm.mime_type as string)" />
                </Flex>
                <Flex :padding="1" :gap=".5">
                    <h3 class="margin-0">{{ propertyForm.name }}</h3>
                    <span>{{ humanFileSize(propertyForm.meta.size) }}</span>
                </Flex>
            </template>
        </IodPopup>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type IodInput from '~/components/Iod/IodInput.vue'
    import type IodPopup from '~/components/Iod/IodPopup.vue'

    type MediaItem = {
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



    definePageMeta({
        middleware: 'auth',
    })

    const route = useRoute()
    const uploadManager = useUploadStore()
    const NuxtLink = defineNuxtLink({})



    const path = computed(() => (route.params.path as string[] || ['public']).filter(e => e).join('/'))
    const items = ref<MediaItem[]>([])

    async function fetchItems()
    {
        const { data } = await useAxios().get(`/api/media/${path.value}`)
        items.value = data.data
    }

    watch(path, fetchItems, { immediate: true })



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



    const uploadInput = ref<HTMLInputElement|null>(null)

    async function upload(files: any)
    {
        // Check if files are available
        if (!files.length) return

        // Upload files
        await uploadManager.upload(path.value, files)

        // Reset input
        if (uploadInput.value) uploadInput.value.value = ''
        
        // Fetch items
        fetchItems()
    }



    const createFolderPopup = ref<typeof IodPopup|null>(null)
    const createFolderInput = ref<typeof IodInput|null>(null)
    const createFolderForm = useForm({ name: 'Neuer Ordner' })

    function openCreateFolderPopup()
    {
        createFolderForm.reset()
        createFolderPopup.value?.open()
        createFolderInput.value?.focus()
        nextTick(() => createFolderInput.value?.input?.select())
    }

    function closeCreateFolderPopup()
    {
        createFolderPopup.value?.close()
    }

    async function createFolder()
    {
        createFolderForm
        .transform(data => ({...data, path: path.value}))
        .post('/api/folder', {
            onSuccess() {
                createFolderForm.reset()
                createFolderPopup.value?.close()
                fetchItems()
            }
        })
    }



    const renamePopup = ref<typeof IodPopup|null>(null)
    const renameInput = ref<typeof IodInput|null>(null)
    const renameForm = useForm({ path: '', name: '' })

    function openRenamePopup(item: MediaItem)
    {
        renameForm.path = item.src_path
        renameForm.name = item.name
        
        renamePopup.value?.open()
        renameInput.value?.focus()

        // Get selection range
        let start = 0
        let end = item.mime_type === 'folder' ? item.name.length : item.name.lastIndexOf('.')

        nextTick(() => renameInput.value?.input?.setSelectionRange(start, end))
    }

    function closeRenamePopup()
    {
        renamePopup.value?.close()
    }

    async function rename()
    {
        renameForm.patch('/api/media/rename', {
            onSuccess() {
                renameForm.reset()
                renamePopup.value?.close()
                fetchItems()
                deselectAll()
            }
        })
    }



    const propertyPopup = ref<typeof IodPopup|null>(null)
    const propertyForm = useForm({} as MediaItem)

    function openPropertyPopup(item: MediaItem)
    {
        propertyForm.defaults(item).reset()
        propertyPopup.value?.open()
    }



    function move(paths: string[], destination: string)
    {
        useForm({
            paths,
            destination,
        })
        .patch('/api/media/move', {
            onSuccess() { fetchItems(); deselectAll() },
            onError(errors: any) { console.log(errors.data) }
        })
    }



    function copy(paths: string[], destination: string)
    {
        useForm({
            paths,
            destination,
        })
        .post('/api/media/copy', {
            onSuccess() { fetchItems(); deselectAll() },
            onError(errors: any) { console.log(errors.data) }
        })
    }



    const dragging = ref(false)

    function onDragStart(event: DragEvent, item: MediaItem)
    {
        if (!selection.value.includes(item.src_path))
        {
            selection.value = [item.src_path]
        }
        
        dragging.value = true
    }

    function onDragEnd(event: DragEvent)
    {
        dragging.value = false
    }

    function onDrop(event: DragEvent, path: string)
    {
        // console.log(selection.value[0], path)
        dragging.value = false

        event.ctrlKey ? copy(selection.value, path) : move(selection.value, path)
    }

    onMounted(() => {
        window.addEventListener('dragend', onDragEnd)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('dragend', onDragEnd)
    })



    async function deleteItems(paths: string[])
    {
        const { data } = await useAxios().delete(`/api/media/`, { data: { paths } })

        fetchItems()
        deselectAll()
    }



    function discover()
    {
        useAxios().patch('/api/media/discovery', { path: path.value })
    }
</script>

<style lang="sass" scoped>
    .sidebar-icons
        .iod-button
            --local-color-background: var(--color-text-soft)

    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
        gap: 1rem



    .selection-bar
        position: sticky
        top: 1rem
        margin-top: 1rem
        z-index: 100
        display: flex
        align-items: center
        height: 4rem
        padding-inline: 1rem
        gap: .5rem
        background-color: var(--color-background)
        box-shadow: var(--shadow-elevation-low)
        border-radius: var(--radius-l)
</style>
