<template>
    <IodPopup ref="popup" :title="title" max-width="70rem" blur="0">
        <div class="layout">
            <div class="header">
                <IodIconButton type="button" variant="text" corner="pill" icon="refresh" @click="fetchItems" background="var(--color-text-soft)" v-tooltip="'Aktualisieren'"/>
                <MediaBreadcrumbs class="flex-1" :path="path" @navigate="openDirectory($event)">
                    <template #left>
                        <VDropdown placement="bottom">
                            <IodIconButton type="button" variant="text" corner="pill" icon="expand_more" size="s" v-tooltip="'Ordner auswählen'"/>
        
                            <template #popper>
                                <ContextMenu class="min-w-80">
                                    <ContextMenuItem @click="openDirectory('domain')" v-close-popper show-chevron icon="home_storage">Hauptspeicher</ContextMenuItem>
                                    <ContextMenuItem @click="openDirectory('profiles')" v-close-popper show-chevron icon="switch_account">Profil Dateien</ContextMenuItem>
                                    <ContextMenuItem @click="openDirectory('forms')" v-close-popper show-chevron icon="edit_square">Formular Dateien</ContextMenuItem>
                                </ContextMenu>
                            </template>
                        </VDropdown>
                    </template>
                </MediaBreadcrumbs>
                <!-- <VDropdown placement="bottom-end">
                    <IodButton type="button" icon-right="add" label="Neu" corner="pill" size="m"/>
                    <template #popper>
                        <ContextMenu class="min-w-80">
                            <ContextMenuItem icon="upload" v-close-popper @click="uploadInput?.click()">Hochladen</ContextMenuItem>
                            <ContextMenuItem icon="create_new_folder" v-close-popper @click="createDirectoryPopup.open(path)">Ordner erstellen</ContextMenuItem>
                        </ContextMenu>
                    </template>
                </VDropdown> -->

                <IodLoader type="bar" v-show="loading"/>
            </div>

            <div class="main small-scrollbar">
                <div class="entity-grid" v-if="displayableItems?.length">
                    <MediaItem
                        v-for="item in displayableItems"
                        :key="item.id"
                        :selected="selection.includes(item)"
                        :item="item"
                        @click="select($event, item)"
                        @dblclick="navigateOrForceSelect($event, item)"
                    />
                </div>
            </div>
            
            <div class="footer">
                <IodInput class="!h-10 flex-1" placeholder="Auswahl" :modelValue="selection.map(e => e.name).join(', ')" disabled/>
                <IodButton type="button" :label="title" :disabled="!selection.length" @click="confirmSelection"/>
            </div>
        </div>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~~/types/media'



    const props = defineProps({
        multiple: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'file'
        },
        mime: {
            type: String,
            default: ''
        },
        rootPath: {
            type: String,
            default: ''
        },
    })



    // START: Misc vars
    const popup = ref()
    
    const title = computed(() => {
        if (props.multiple && props.type === 'file') return 'Dateien auswählen'
        if (props.multiple && props.type === 'directory') return 'Ordner auswählen'
        if (!props.multiple && props.type === 'file') return 'Datei auswählen'
        if (!props.multiple && props.type === 'directory') return 'Ordner auswählen'
        return 'Medien auswählen'
    })

    const emits = defineEmits(['select'])
    defineExpose({ open })
    // END: Misc vars
    

    
    // START: Fetch items
    let callback = ((data: any) => {}) as Function
    const path = ref(props.rootPath || 'domain')
    const items = ref([] as MediaItem[])
    const loading = ref(false)

    async function fetchItems() {
        loading.value = true
        const { data } = await useAxios().get(apiRoute('/api/media/:path', {
            path: path.value,
        }))
        loading.value = false
        items.value = data.data
    }

    const displayableItems = computed(() => {
        if (props.type === 'directory') return filterByType(items.value, 'directory')
        if (props.mime) return filterByMime(items.value, props.mime, true)
        return items.value
    })

    const selectableItems = computed(() => {
        if (props.type === 'directory') return filterByType(items.value, 'directory')
        if (props.mime) return filterByMime(items.value, props.mime)
        return filterByType(items.value, 'file')
    })

    watch(path, fetchItems, { immediate: true })
    // END: Fetch items



    // START: Filter
    function filterByType(items: MediaItem[], type: string) {
        if (type === 'file') return items.filter(item => item.mime_type !== 'directory')
        if (type === 'directory') return items.filter(item => item.mime_type === 'directory')
    }

    function filterByMime(items: MediaItem[], mime: string, allowDirectories: boolean = false) {
        const parts = mime.split('/')

        return items.filter(item => {
            const mime = (item.mime_type || '').split('/')

            if (allowDirectories && mime[0] === 'directory') return true

            return (parts[0] === '*' || mime[0] === parts[0]) && (parts[1] === '*' || mime[1] === parts[1])
        })
    }
    // END: Filter



    // START: Navigation
    function navigateOrForceSelect(event: MouseEvent, item: MediaItem) {
        if (item.mime_type === 'directory')
        {
            openDirectory(item.src_path)
        }
        else
        {
            select(event, item)
            confirmSelection()
        }
    }

    function openDirectory(p: string) {
        if (path.value !== p) deselectAll()

        path.value = p
    }
    // END: Navigation



    // START: Selection
    const selection = ref([] as MediaItem[])

    function select(event: MouseEvent, item: MediaItem) {
        if (props.multiple && event.ctrlKey)
        {
            if (selection.value.map(p => p.src_path).includes(item.src_path))
            {
                selection.value = selection.value.filter(p => p.src_path !== item.src_path)
            }
            else
            {
                selection.value.push(item)
            }
        }
        else if (props.multiple && event.shiftKey)
        {
            const index = items.value.findIndex(i => i.src_path === item.src_path)
            const start = items.value.findIndex(i => i.src_path === selection.value[0].src_path)
            const end = index

            selection.value = start < end
                ? items.value.slice(start, end + 1)
                : items.value.slice(end, start + 1)
        }
        else
        {
            selection.value = [item]
        }

        selection.value = selection.value.filter(p => selectableItems.value?.map(i => i.src_path)?.includes(p.src_path))
    }

    function deselectAll() {
        selection.value = []
    }
    // END: Selection



    // START: API functions
    function open(cb: Function|null = null) {
        deselectAll()
        if (cb !== null) callback = cb
        popup.value.open()
    }

    function confirmSelection() {
        if (selection.value.length === 0) return

        let confirmedSelection = props.multiple ? selection.value : selection.value[0]
        
        emits('select', confirmedSelection)
        callback(confirmedSelection)
        
        popup.value.close()
    }
    // END: API functions
</script>

<style lang="sass" scoped>
    .layout
        display: grid
        grid-template-columns: 1fr
        grid-template-rows: 4rem 33rem 4rem
        grid-template-areas: 'header' 'main' 'footer'

        .header
            grid-area: header
            position: relative
            display: flex
            gap: .5rem
            padding-inline: 1rem
            align-items: center
            border-bottom: 1px solid var(--color-border)

            .iod-loader
                position: absolute
                left: 0
                right: 0
                bottom: -1px
                height: 2px !important

        .main
            grid-area: main
            overflow-y: scroll

            .entity-grid
                display: grid
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
                gap: 1rem
                padding: 1rem

        .footer
            grid-area: footer
            display: flex
            gap: 1rem
            padding-inline: 1rem
            align-items: center
            border-top: 1px solid var(--color-border)
</style>