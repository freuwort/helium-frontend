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
    import TableColumnBuilder from '~/classes/Builder/TableColumnBuilder'
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

    const tableColumnBuilder = new TableColumnBuilder()
    const tableColumns = [
        tableColumnBuilder.new().name('id').label('ID').width(70).build(),
        tableColumnBuilder.new().name('type').label('Typ').transform((value: string | null) => { switch (value) {
            case 'POS': return { text: 'Kassensystem', icon: 'point_of_sale', color: '#FF4757' }
            case 'KIOSK': return { text: 'Info-Anzeige', icon: 'desktop_windows', color: '#84cc16' }
            default: return '-'
        }}).build(),
        tableColumnBuilder.new().name('name').label('Name').build(),
        tableColumnBuilder.new().name('address').label('Standort').sortable(false).transform((value: any) => stringFromAddress(value) || null).build(),
        tableColumnBuilder.new().name('os_platform').label('Betriebssystem').transform((value: any, item: any) => ({
            text: stringFromOS(item) || '-',
            icon: 'deployed_code',
            color: 'var(--color-info)',
        })).build(),
        tableColumnBuilder.new().name('app_version').label('Software Version').build(),
        tableColumnBuilder.new().name('created_at').label('Erstellt').transform((value: string | null) => ({
            text: value ? dayjs(value).fromNow() : 'Nie',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : 'Nie',
        })).build(),
        tableColumnBuilder.new().name('updated_at').label('Aktualisiert').transform((value: string | null) => ({
            text: value ? dayjs(value).fromNow() : '-',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-',
        })).build(),
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
