<template>
    <IodPopup ref="popup" title="Screen finden" max-width="850px" blur="0">
        <IodTable
            :scope
            :items="items"
            :columns="tableColumns"
            :loading="loading"
            v-model:selection="selection"
            v-model:filter="filter"
            @request:refresh="fetch()"
        >
            <template #right>
                <IodButton type="button" label="Auswählen" corner="pill" :loading :disabled="selection.length === 0" @click="confirmSelection()"/>
            </template>
        </IodTable>
    </IodPopup>
</template>

<script lang="ts" setup>
    const props = defineProps({
        multiple: {
            type: Boolean,
            default: false
        },
    })

    
    
    // START: Basic variables and setup
    const scope = 'view_admin_dialog_screen_screens_index'
    const popup = ref()
    const loading = ref(false)

    const items = ref([])
    const selection = ref([])

    const filter = ref({
        search: '',
    })

    const sort = ref({
        field: null,
        order: 'desc',
    })

    const pagination = ref({
        page: 1,
        size: 20,
        from: 0,
        to: 0,
        total: 0,
        lastPage: 1,
    })

    const tableColumns = [
        { name: 'id', label: 'ID', valuePath: 'id', sortable: true, width: 70, resizeable: true, hideable: true, default: '-', },
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'width', label: 'Breite', valuePath: 'width', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'height', label: 'Höhe', valuePath: 'height', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'duration', label: 'Dauer', valuePath: 'duration', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
    ]
    
    let callback = ((data: any) => {}) as Function
    // END: Basic variables and setup
    


    // START: Fetch items
    async function fetch() {
        loading.value = true

        let route = apiRoute('/api/screens/', {
            filter: filter.value,
            sort: sort.value,
            ...pagination.value,
        })

        const { data } = await useAxios().get(route)

        loading.value = false
        items.value = data.data
    }
    
    watch(filter, fetch, { immediate: false, deep: true })
    watch(sort, fetch, { immediate: false, deep: true })
    watch(pagination, fetch, { immediate: true, deep: true })
    // END: Fetch items
    
    
    
    // START: API functions
    defineExpose({ open })
    
    function open(cb: Function|null = null) {
        if (cb !== null) callback = cb
        selection.value = []
        popup.value.open()
    }
    
    function confirmSelection() {
        if (selection.value.length === 0) return
        
        callback((props.multiple ? selection.value : selection.value[0]))
        
        popup.value.close()
    }
    // END: API functions
</script>

<style lang="sass" scoped>
</style>