<template>
    <NuxtLayout limiter="normal" name="auth-sidebar" pageTitle="Dateien">
        <template #sidebar>
            <Flex padding="1rem 0" class="w-20 h-100p">
                <Flex padding="0 1rem" horizontal>
                    <IodButton class="upload-button" type="button" shape="pill" icon-left="upload" label="Hochladen" size="large" @click="uploadInput?.click()"/>
                    <Spacer />
                    <IodIconButton class="new-folder-button" type="button" shape="pill" icon="create_new_folder" size="large" v-tooltip="'Ordner erstellen'" @click="openCreateFolderPopup"/>
                </Flex>
                <ContextMenuDivider />
                <ContextMenuItem :is="NuxtLink" to="/d/files/public" icon="public">Öffentliche Ablage</ContextMenuItem>
                <ContextMenuItem :is="NuxtLink" to="/d/files/private" icon="lock">Geschützte Ablage</ContextMenuItem>
                <ContextMenuItem :is="NuxtLink" to="/d/files/profile_pictures" icon="account_circle">Profilbilder</ContextMenuItem>
                <ContextMenuItem :is="NuxtLink" to="/d/files/profile_banners" icon="landscape">Profilbanner</ContextMenuItem>
                <!-- <ContextMenuItem :is="NuxtLink" to="/d/files/trash" icon="delete">Papierkorb</ContextMenuItem> -->
                <ContextMenuDivider />
                <Flex padding="0 1rem" :gap=".5">
                    <!-- move -->
                    <Flex is="form" @submit.prevent="move">
                        <IodInput label="Pfad" v-model="moveForm.destination" :helper="moveForm.path">
                            <template #right>
                                <IodButton type="submit" size="small" label="Verschieben" :loading="moveForm.processing" />
                            </template>
                        </IodInput>
                    </Flex>
                    
                    <!-- copy -->
                    <Flex is="form" @submit.prevent="copy">
                        <IodInput label="Pfad" v-model="copyForm.destination" :helper="copyForm.path">
                            <template #right>
                                <IodButton type="submit" size="small" label="Kopieren" :loading="copyForm.processing" />
                            </template>
                        </IodInput>
                    </Flex>
                </Flex>
                <Spacer />
                <ContextMenuDivider />
                <Flex class="sidebar-icons" padding="0 1rem" :gap=".5" horizontal>
                    <IodIconButton type="button" variant="text" shape="pill" icon="scan" v-tooltip="'Verzeichnisse scannen'" @click="discover"/>
                    <IodIconButton type="button" variant="text" shape="pill" icon="refresh" v-tooltip="'Aktualisieren'" @click="fetchItems"/>
                    <Spacer />
                    <IodIconButton type="button" variant="text" shape="pill" icon="settings" v-tooltip="'Einstellungen'"/>
                </Flex>
            </Flex>
        </template>

        <Flex padding="0 1rem" :gap="1">
            <Flex class="h-6" padding="1rem 0 0 0">
                <MediaBreadcrumbs :path="path" root-path="/d/files" />
            </Flex>
            
            <div class="entity-grid">
                <TransitionGroup>
                    <MediaItem
                        v-for="item in items"
                        :key="item.id"
                        :item="item"
                        :selected="selection.includes(item.src_path)"
                        @click="select($event, item.src_path)"
                        @edit="console.log"
                        @rename="openRenamePopup"
                        @move="moveForm.path = item.src_path"
                        @copy="copyForm.path = item.src_path"
                        @delete="deleteItem"
                    />
                </TransitionGroup>
            </div>

            <IodAlert v-if="!items.length" class="h-20" as="placeholder">Keine Dateien vorhanden</IodAlert>
        </Flex>
        


        <MediaUploadCard />
        <input class="display-none" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
        
        <IodPopup ref="createFolderPopup" title="Ordner erstellen" max-width="400px">
            <Flex is="form" :padding="1" :gap="1" @submit.prevent="createFolder">
                <ErrorAlert :errors="createFolderForm.errors" />

                <IodInput label="Name" ref="createFolderInput" v-model="createFolderForm.name" />
                <Flex horizontal>
                    <IodButton type="button" size="small" label="Abbrechen" variant="text" @click="closeCreateFolderPopup" :loading="createFolderForm.processing" />
                    <Spacer />
                    <IodButton type="submit" size="small" label="Ordner Erstellen" :loading="createFolderForm.processing" />
                </Flex>
            </Flex>
        </IodPopup>

        <IodPopup ref="renamePopup" title="Umbenennen" max-width="400px">
            <Flex is="form" :padding="1" :gap="1" @submit.prevent="rename">
                <IodInput label="Name" ref="renameInput" v-model="renameForm.name" />
                <Flex horizontal>
                    <IodButton type="button" size="small" label="Abbrechen" variant="text" @click="closeRenamePopup" :loading="renameForm.processing" />
                    <Spacer />
                    <IodButton type="submit" size="small" label="Umbenennen" :loading="renameForm.processing" />
                </Flex>
            </Flex>
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
            }
        })
    }



    const moveForm = useForm({
        path: '',
        destination: '',
    })

    async function move()
    {
        moveForm.patch('/api/media/move', {
            onSuccess() {
                moveForm.reset()
                fetchItems()
            }
        })
    }



    const copyForm = useForm({
        path: '',
        destination: '',
    })

    async function copy()
    {
        copyForm.post('/api/media/copy', {
            onSuccess() {
                copyForm.reset()
                fetchItems()
            }
        })
    }



    async function deleteItem(item: MediaItem)
    {
        const { data } = await useAxios().delete(`/api/media/`, {
            data: { path: item.src_path },
        })

        fetchItems()
    }



    function discover()
    {
        useAxios().patch('/api/media/discovery', { path: path.value })
    }
</script>

<style lang="sass" scoped>
    .upload-button,
    .new-folder-button
        box-shadow: var(--shadow-elevation-medium)

    .sidebar-icons
        .iod-button
            --local-color-background: var(--color-text-soft)

    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
        gap: 1rem
</style>
