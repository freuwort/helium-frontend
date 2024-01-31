<template>
    <NuxtLayout name="auth-default" pageTitle="Dateien" color="var(--color-primary)">
        <Card>
            <Flex :padding="2" :gap="1">
                <Flex horizontal>
                    <MediaBreadcrumbs :path="path" root-path="/d/files" />
                    <Spacer />
                    <IodButton type="button" size="small" label="Hochladen" icon-right="upload" @click="uploadInput?.click()" />
                    <input class="display-none" type="file" ref="uploadInput" multiple @change="upload(($event.target as HTMLInputElement)?.files || [])">
                </Flex>
                
                <hr>
                
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

                <hr>

                <div class="entity-grid">
                    <TransitionGroup>
                        <Card is="button" type="button" class="flex vertical" v-for="item in items" :key="item.id">
                            <Flex :padding=".5">
                                <Flex class="aspect-ratio-1-1" x-align="center" y-align="center">
                                    <MediaIcon :mime="(item.mime_type as string)" />
                                </Flex>
                                <hr>
                                <Flex padding="0 .5rem">
                                    <NuxtLink :to="`/d/files/${item.src_path}`">{{ item.name }}</NuxtLink>
                                    <a :href="(item.cdn_path as string)" target="_blank" rel="noopener noreferrer">Öffnen</a>
                                    <Flex horizontal>
                                        <small>{{ humanFileSize(item.meta.size || 0) }}</small>
                                        <Spacer />
                                        <small>{{ item.meta.extension }}</small>
                                    </Flex>
                                </Flex>
                                <hr>
                                <Flex horizontal :gap=".5">
                                    <IodIconButton type="button" icon="edit" variant="text " size="small" color-preset="primary" @click="renameForm.path = item.src_path"/>
                                    <IodIconButton type="button" icon="drive_file_move" variant="text " size="small" color-preset="primary" @click="moveForm.path = item.src_path"/>
                                    <IodIconButton type="button" icon="file_copy" variant="text " size="small" color-preset="primary" @click="copyForm.path = item.src_path"/>
                                    <Spacer />
                                    <IodIconButton type="button" icon="delete" variant="text " size="small" color-preset="error" @click="deleteItem(item.src_path)"/>
                                </Flex>
                            </Flex>
                        </Card>
                    </TransitionGroup>
                </div>
            </Flex>
        </Card>

        <MediaUploadCard />
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
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
        gap: 1rem

        > button
            border-radius: var(--radius-l)
            box-shadow: none
            border-color: var(--color-border)
</style>
