<template>
    <NuxtLayout name="auth-default" :pageTitle="IPM.options.pageTitle" color="#10b981">
        <HeCard>
            <IodTable
                :columns="tableColumns"
                :actions="tableActions"
                :filter-settings="tableFilters"
                :items="IPM.items"
                :scope="IPM.options.scope"
                :loading="IPM.processing"
                v-model:selection="IPM.selection"
                v-model:filter="IPM.modelFilter"
                v-model:sort="IPM.modelSort"
                v-model:pagination="IPM.modelPagination"
                @request:refresh="IPM.fetch()"
            >
                <template #left>
                    <IodIconButton :is="NuxtLink" :to="'/d/events/editor/' + $route.params.event_id" variant="text" icon="arrow_back" v-tooltip="'Zum Event'"/>
                </template>

                <template #wrapped-right>
                    <IodIconButton type="button" size="s" variant="text" icon="cloud_upload" v-tooltip="'Importieren'" @click="importPopup.select()"/>
                    <IodIconButton type="button" size="s" variant="text" icon="file_save" v-tooltip="'Exportieren'"/>
                    <IodIconButton type="button" size="s" variant="text" icon="stacked_email" v-tooltip="'Massenmail versenden'" @click="sendEmailPopup.open(IPM.keys)"/>
                </template>

                <template #right>
                    <IodButton type="button" variant="filled" label="Neue&nbsp;Einladung" @click="IPM.open()"/>
                </template>
            </IodTable>
        </HeCard>

        <DialogCsvImport ref="importPopup" :expected-values="expectedValues" @import="importInvites" />
        <DialogSendTemplatedEmail ref="sendEmailPopup" :templates="templates" @send="sendEmail"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const dayjs = useDayjs()
    const NuxtLink = defineNuxtLink({})
    
    definePageMeta({
        middleware: 'auth',
    })



    // Params
    const eventId = computed(() => useRoute().params.event_id ?? null)

    const IPM = useItemPageManager({
        pageTitle: 'Event-Einladungen Verwaltung',
        scope: 'admin.event-invites.index',
        routes: {
            fetch: '/api/events/'+eventId.value+'/invites/',
            duplicate: '/api/events/'+eventId.value+'/invites/:id/duplicate',
            delete: '/api/events/'+eventId.value+'/invites/',
            editor: '/d/events/'+eventId.value+'/invites/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'type', label: 'Einladungstyp', valuePath: 'type', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'email', label: 'Email', valuePath: 'email', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'phone', label: 'Telefon', valuePath: 'phone', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'status', label: 'Status', valuePath: 'status', sortable: true, width: 200, resizeable: true, hideable: true, default: 'pending' },
        { name: 'user_id', label: 'Zugewiesener Nutzer', valuePath: 'user_id', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => {
            if (!value) return '-'
            return {
                text: item.user.name || '-',
                tooltip: item.user.name,
                image: item.user.profile_image,
                icon: 'person',
            }
        }},
        { name: 'code', label: 'Code', valuePath: 'code', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'created_at', label: 'Erstellt', valuePath: 'created_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
        { name: 'updated_at', label: 'Zuletzt geändert', valuePath: 'updated_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) => value ? ({ text: dayjs(value).fromNow(), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
    ]

    const tableActions = [
        {
            icon: 'edit',
            text: 'Bearbeiten',
            color: 'var(--color-text)',
            individual: true,
            multiple: false,
            triggerOnRowClick: true,
            isAvailable: () => true,
            run: (items: (number | string)[]) => IPM.open(items[0]),
        },
        {
            icon: 'content_copy',
            text: 'Duplizieren',
            color: 'var(--color-text)',
            individual: true,
            multiple: false,
            triggerOnRowClick: false,
            isAvailable: () => true,
            run: (items: (number | string)[]) => IPM.duplicate(items[0]),
        },
        {
            icon: 'delete',
            text: 'Löschen',
            color: 'var(--color-error)',
            individual: true,
            multiple: true,
            triggerOnRowClick: false,
            isAvailable: () => true,
            run: (items: (number | string)[]) => IPM.delete(items),
        },
    ]
    
    const tableFilters = ref([
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            multiple: true,
            values: [
                { value: 'pending', text: 'Ausstehend' },
                { value: 'accepted', text: 'Angenommen' },
                { value: 'maybe', text: 'Unter Vorbehalt' },
                { value: 'rejected', text: 'Abgelehnt' },
            ],
        },
        {
            name: 'type',
            label: 'Einladungstyp',
            type: 'select',
            multiple: true,
            values: computed(() => IPM.availableFilterValues['type']?.map((item: any) => ({ value: item, text: item })) || []),
        }
    ])

    

    // START: Import
    const importPopup = ref()

    const expectedValues = [
        { name: 'type', label: 'Einladungstyp', default: null },
        { name: 'name', label: 'Name', default: null },
        { name: 'email', label: 'Email', default: null },
        { name: 'phone', label: 'Telefon', default: null },
        { name: 'code', label: 'Code', default: null },
        { name: 'user_id', label: 'Nutzer ID', default: null },
        { name: 'status', label: 'Status', default: null },
    ]

    async function importInvites(data: any[])
    {
        await useAxios().post('/api/events/'+eventId.value+'/invites/import', {items: data})

        toast.success('Einladungen wurden importiert')

        IPM.fetch()
    }
    // END: Import



    // START: Export
    // END: Export



    // START: Send mail
    const sendEmailPopup = ref()

    const templates = [
        { template: '{{email}}', name: 'Email', type: 'email' },
        { template: '{{phone}}', name: 'Telefonnummer', type: 'text' },
        { template: '{{status}}', name: 'RSVP-Status', type: 'text' },
        { template: '{{code}}', name: 'Einladungscode', type: 'text' },
        { template: '{{invite_link}}', name: 'Einladungslink', type: 'html' },
        { template: '{{user_name}}', name: 'Name des Nutzers', type: 'text' },
        { template: '{{created_at}}', name: 'Erstellungsdatum', type: 'date' },
        { template: '{{updated_at}}', name: 'Zuletzt geändert', type: 'date' },
    ]

    async function sendEmail(data: any)
    {
        await useAxios().patch('/api/events/'+eventId.value+'/invites/email', data)

        toast.success('Emails wurden gesendet')
    }
    // END: Send mail
</script>

<style lang="sass" scoped></style>
