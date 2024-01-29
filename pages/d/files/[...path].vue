<template>
    <NuxtLayout name="auth-default" pageTitle="Dateien" color="var(--color-primary)">
        <Card>
            <Flex :padding="2" :gap="1">
                <Flex horizontal>
                    <span>{{ path }}</span>
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

                <Flex is="form" @submit.prevent="rename">
                    <IodInput label="Name" v-model="renameForm.name" :helper="renameForm.path">
                        <template #right>
                            <IodButton type="submit" size="small" label="Umbenennen" :loading="renameForm.processing" />
                        </template>
                    </IodInput>
                </Flex>

                <hr>

                <div class="entity-grid">
                    <Card is="button" type="button" class="flex vertical" v-for="item in items" :key="item.id">
                        <Flex :padding=".5">
                            <IodIcon class="aspect-ratio-1-1" style="font-size: 5rem" :icon="item.mime_type === 'folder' ? 'folder' : 'note'" />
                            <hr>
                            <Flex padding="0 .5rem">
                                <NuxtLink :to="`/d/files/${item.src_path}`">{{ item.name }}</NuxtLink>
                                <Flex horizontal>
                                    <small>{{ humanFileSize(item.meta.size || 0) }}</small>
                                    <Spacer />
                                    <small>{{ item.meta.extension }}</small>
                                </Flex>
                            </Flex>
                            <hr>
                            <Flex horizontal :gap=".5">
                                <IodIconButton type="button" icon="drive_file_move" variant="text " size="small" color-preset="primary" />
                                <IodIconButton type="button" icon="edit" variant="text " size="small" color-preset="primary" @click="renameForm.path = item.src_path"/>
                                <Spacer />
                                <IodIconButton type="button" icon="delete" variant="text " size="small" color-preset="error" @click="deleteItem(item.src_path)"/>
                            </Flex>
                        </Flex>
                    </Card>
                </div>
            </Flex>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    type Item = {
        id: number
        name: string
        mime_type: string
        meta: {
            size: number
            extension: string
        }
        src_path: string
    }



    definePageMeta({
        middleware: 'auth',
    })

    const route = useRoute()



    const path = computed(() => (route.params.path as string[] || ['public']).filter(e => e).join('/'))
    const items = ref<Item[]>([])

    async function fetchItems()
    {
        const { data } = await useAxios().get(`/api/media/${path.value}`)
        items.value = data
    }

    watch(path, fetchItems, { immediate: true })



    const uploadInput = ref<HTMLInputElement|null>(null)

    async function upload(files: any)
    {
        // Check if files are available
        if (!files.length) return

        // Create form data
        const form = new FormData()

        // Add files to form data
        for (let i = 0; i < files.length; i++)
        {
            form.append('files[]', files[i])
        }

        // Add directory to form data
        form.append('path', path.value)

        // Reset input
        if (uploadInput.value) uploadInput.value.value = ''
        
        const { data, status } = await useAxios().post('/api/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                console.log(Math.round(progressEvent.loaded / (progressEvent.total || 1) * 100))
            }
        })
        
        if (status === 200)
        {
            fetchItems()
        }
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
