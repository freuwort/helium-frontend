<template>
    <NuxtLayout limiter="full" name="auth-default" pageTitle="Dateien" color="var(--color-text)">
        <Flex :padding="2" :gap="1">
            <Flex horizontal :gap="1">
                <VDropdown placement="bottom-start">
                    <IodButton type="button" shape="pill" label="Neu" icon-left="add" size="large" />
                    <template #popper>
                        <ContextMenu class="min-w-15">
                            <ContextMenuItem is="button" icon="upload" @click="uploadInput?.click()">Hochladen</ContextMenuItem>
                            <ContextMenuItem is="button" icon="create_new_folder" @click="createFolderForm.name = ''">Ordner erstellen</ContextMenuItem>
                        </ContextMenu>
                    </template>
                </VDropdown>
                <VDropdown >
                    <IodIconButton type="button" shape="pill" icon="more_vert" />
                    <template #popper>
                        <ContextMenu class="min-w-15">
                            <ContextMenuItem is="button" icon="scan" @click="discover">Verzeichnisse scannen</ContextMenuItem>
                        </ContextMenu>
                    </template>
                </VDropdown>
                <MediaBreadcrumbs :path="path" root-path="/d/files" />
                <Spacer />
            </Flex>
            
            <div class="entity-grid">
                <TransitionGroup>
                    <MediaItem
                        v-for="item in items"
                        :key="item.id"
                        :item="item"
                        @view="console.log"
                        @delete="deleteItem"
                        @rename="renameForm.path = item.src_path"
                        @move="moveForm.path = item.src_path"
                        @copy="copyForm.path = item.src_path"
                    />
                </TransitionGroup>
            </div>
            
            <Flex is="form" @submit.prevent="createFolder">
                <IodInput label="Ordner" v-model="createFolderForm.name">
                    <template #right>
                        <IodButton type="submit" size="small" label="Erstellen" :loading="createFolderForm.processing" />
                    </template>
                </IodInput>
            </Flex>
            
            <!-- rename -->
            <Flex is="form" @submit.prevent="rename">
                <IodInput label="Name" v-model="renameForm.name" :helper="renameForm.path">
                    <template #right>
                        <IodButton type="submit" size="small" label="Umbenennen" :loading="renameForm.processing" />
                    </template>
                </IodInput>
            </Flex>
            
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
        
        <MediaUploadCard />
        <input class="display-none" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
    </NuxtLayout>
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



    definePageMeta({
        middleware: 'auth',
    })

    const route = useRoute()
    const uploadManager = useUploadStore()



    const path = computed(() => (route.params.path as string[] || ['public']).filter(e => e).join('/'))
    const items = ref<Item[]>([])

    async function fetchItems()
    {
        const { data } = await useAxios().get(`/api/media/${path.value}`)
        items.value = data.data
    }

    watch(path, fetchItems, { immediate: true })



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



    const createFolderForm = useForm({
        name: '',
    })

    async function createFolder()
    {
        createFolderForm
        .transform(data => ({...data, path: path.value}))
        .post('/api/folder', {
            onSuccess() {
                createFolderForm.reset()
                fetchItems()
            }
        })
    }



    const renameForm = useForm({
        path: '',
        name: '',
    })

    async function rename()
    {
        renameForm.patch('/api/media/rename', {
            onSuccess() {
                renameForm.reset()
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



    async function deleteItem(path: string)
    {
        const { data } = await useAxios().delete(`/api/media/`, {
            data: { path }
        })

        fetchItems()
    }



    function discover()
    {
        useAxios().patch('/api/media/discovery', { path: path.value })
    }
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
        gap: 1rem
</style>
