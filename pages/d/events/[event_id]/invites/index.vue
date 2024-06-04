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
                <template #header>
                    <IodButton type="button" label="Neue Einladung" @click="IPM.open()"/>
                    <IodButton type="button" label="Importieren" @click="importPopup.select()"/>
                </template>
            </IodTable>
        </HeCard>

        <DialogCsvImport ref="importPopup" :expected-values="expectedValues" @import="importInvites" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const dayjs = useDayjs()
    
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
        { name: 'email', label: 'Email', valuePath: 'email', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'phone', label: 'Telefon', valuePath: 'phone', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
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
        { name: 'status', label: 'Status', valuePath: 'status', sortable: true, width: 200, resizeable: true, hideable: true, default: 'pending' },
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

    const tableFilters = [] as any[]



    // START: Import
    const importPopup = ref()

    const expectedValues = [
        { name: 'email', label: 'Email', default: null },
        { name: 'phone', label: 'Telefon', default: null },
        { name: 'code', label: 'Code', default: null },
        { name: 'user_id', label: 'Nutzer ID', default: null },
        { name: 'status', label: 'Status', default: null },
    ]

    async function importInvites(data: any[])
    {
        await useAxios().post('/api/events/'+eventId.value+'/invites/import', {items: data})

        IPM.fetch()
    }
    // END: Import
</script>

<style lang="sass" scoped></style>
