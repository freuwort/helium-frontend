<template>
    <NuxtLayout name="auth-default" :scope :pageTitle="IPM.options.pageTitle">
        <HeCard>
            <IodTable
                class="top-16"
                :scope
                :columns="tableColumns"
                :actions="tableActions"
                :filterSettings="tableFilters"
                :items="IPM.items"
                :loading="IPM.processing"
                v-model:selection="IPM.selection"
                v-model:filter="IPM.modelFilter"
                v-model:sort="IPM.modelSort"
                v-model:pagination="IPM.modelPagination"
                v-model:columnSettings="IPM.modelColumnSettings"
                @request:refresh="IPM.fetch()"
            >
                <template #right>
                    <IodButton type="button" label="Neues Gerät" corner="pill" icon-right="add" @click="openNewDeviceSetup()"/>
                </template>
            </IodTable>
        </HeCard>

        <IodPopup ref="newDevicePopup" title="Neues Gerät einrichten" max-width="500px">
            <div class="flex flex-col gap-4 p-6">
                <IodAlert type="info" icon="info">
                    <p>Beginnen Sie Ihre Geräteeinrichtung, in dem Sie folgende Daten auf Ihrem neuen Gerät eingeben.</p>
                </IodAlert>
                <div class="flex flex-col">
                    <span>Ihre Helium API Adresse:</span>
                    <code class="p-2 rounded-lg">{{ runtimeConfig.public.backendUrl }}</code>
                </div>
                <div class="flex flex-col">
                    <span>Ihr Geräte PIN {{ dayjs(newDeviceForm.valid_until).format('HH:mm') }}:</span>
                    <code class="p-2 rounded-lg text-center text-4xl tracking-widest">{{ newDeviceForm.pin }}</code>
                </div>
            </div>
        </IodPopup>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'
    import type { FilterSetting } from '~/components/Iod/IodTable.vue'
    
    const dayjs = useDayjs()
    const runtimeConfig = useRuntimeConfig()
    const scope = 'view_admin_devices_index'



    const IPM = useItemPageManager({
        scope,
        pageTitle: 'Geräte Verwaltung',
        routes: {
            fetch: '/api/devices',
            delete: '/api/devices',
        },
    })

    const tableColumns = [
        { name: 'id', label: 'ID', valuePath: 'id', sortable: true, width: 70, resizable: true, hideable: true, default: '-', },
        { name: 'type', label: 'Typ', valuePath: 'type', sortable: true, width: 200, resizable: true, hideable: true, default: '-', },
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizable: true, hideable: true, default: '-', },
        { name: 'os_platform', label: 'Betriebssystem', valuePath: 'os_platform', sortable: true, width: 200, resizable: true, hideable: true, default: '-', },
        { name: 'os_arch', label: 'Architektur', valuePath: 'os_arch', sortable: true, width: 200, resizable: true, hideable: true, default: '-', },
        { name: 'os_release', label: 'OS Version', valuePath: 'os_release', sortable: true, width: 200, resizable: true, hideable: true, default: '-', },
        { name: 'app_version', label: 'Software Version', valuePath: 'app_version', sortable: true, width: 200, resizable: true, hideable: true, default: '-', },
        { name: 'created_at', label: 'Erstellt', valuePath: 'created_at', sortable: true, width: 200, resizable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) : null, },
        { name: 'updated_at', label: 'Aktualisiert', valuePath: 'updated_at', sortable: true, width: 200, resizable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) : null, },
    ]

    const tableActions = [
        {
            icon: 'refresh',
            text: 'Aktualisieren',
            scope: ['global'],
            run: () => IPM.fetch(),
        },
        // {
        //     icon: 'edit',
        //     text: 'Bearbeiten',
        //     scope: ['individual', 'row'],
        //     run: (context: string, items: any) => navigateTo(`/roles/editor/${items[0]}`),
        // },
        // {
        //     icon: 'content_copy',
        //     text: 'Duplizieren',
        //     scope: ['individual'],
        //     run: (context: string, items: (number | string)[]) => IPM.duplicate(items[0]),
        // },
        {
            icon: 'deselect',
            text: 'Auswahl abwählen',
            scope: ['selection'],
            run: (context: string, items: any) => IPM.deselectAll(),
        },
        {
            icon: 'delete',
            text: 'Löschen',
            color: 'var(--color-error)',
            scope: ['selection', 'individual'],
            run: (context: string, items: any) => IPM.delete(items),
        },
    ]

    const tableFilters = ref<FilterSetting[]>([
        {
            name: 'type',
            label: 'Geräte Typ',
            type: 'select',
            multiple: true,
            values: [
                { value: 'pos', text: 'Kassensystem' },
                { value: 'digital_signage', text: 'Digital Signage' },
            ],
        },
    ])



    const newDevicePopup = ref()
    const newDeviceForm = useForm({
        pin: '',
        pin_valid_until: '',
    })

    function openNewDeviceSetup() {
        newDeviceForm.reset()

        newDeviceForm.post('/api/devices', {
            onSuccess(response: any) {
                newDeviceForm.pin = response.pin
                newDeviceForm.valid_until = response.valid_until
                newDevicePopup.value.open()
            },
            onError(error: any) {
                toast.error(error.data)
            },
        })
    }
</script>

<style lang="sass" scoped></style>
