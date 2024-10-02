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
                    <IodButton type="button" label="Neuer Nutzer" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>

                <template #wrapped-right>
                    <IodIconButton type="button" size="s" corner="pill" variant="text" icon="cloud_upload" @click="importPopup.select()" v-tooltip="'Importieren'"/>
                    <!-- <IodIconButton type="button" size="s" corner="pill" variant="text" icon="file_save" @click="true" v-tooltip="'Exportieren'"/> -->
                    <!-- <IodIconButton type="button" size="s" corner="pill" variant="text" icon="stacked_email" @click="sendEmailPopup.open(IPM.keys)" v-tooltip="'Massenmail versenden'"/> -->
                </template>
            </IodTable>
        </HeCard>

        <DialogCsvImport ref="importPopup" :fields="importFields" @import="importUsers" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { FilterSetting } from '~/components/Iod/IodTable.vue'
    import { FieldGroup, Field } from '~/classes/import/CsvImport.ts'
    import { toast } from 'vue3-toastify'
    
    definePageMeta({
        middleware: 'auth',
    })
    
    const dayjs = useDayjs()
    const scope = 'view_admin_users_index'



    const IPM = useItemPageManager({
        scope,
        pageTitle: 'Nutzer Verwaltung',
        routes: {
            fetch: '/api/users',
            duplicate: '/api/users/:id/duplicate',
            delete: '/api/users',
            editor: '/users/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'id', label: 'ID', valuePath: 'id', sortable: true, width: 70, resizeable: true, hideable: true, default: '-', },
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => ({ text: item.fullname || '-', image: item.avatar, icon: 'person', }), },
        { name: 'username', label: 'Nutzername', valuePath: 'username', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', },
        { name: 'email', label: 'Email', valuePath: 'email', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', },
        { name: 'roles', label: 'Rollen', valuePath: 'roles', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: any[]) => value?.map(e => e.name)?.join(', ') || null, },
        { name: 'is_admin', label: 'Berechtigungslevel', valuePath: 'is_admin', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: boolean | null, item: any) => {
            if (item.is_admin) return { text: 'Admin', icon: 'shield', color: 'var(--color-info)', }
            if (item.has_elevated_permissions) return { text: 'Erweitert', icon: 'check_circle', color: 'var(--color-info)', }
            return { text: 'Basis', icon: 'key', color: 'var(--color-text-soft)', }
        }},
        { name: 'email_verified_at', label: 'Email bestätigt', valuePath: 'email_verified_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => {
            return {
                text: value ? dayjs(value).fromNow() : 'Ausstehend',
                tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : 'Ausstehend',
                icon: value ? 'check' : 'close',
                color: value ? 'var(--color-success)' : 'var(--color-error)',
            }
        }},
        { name: 'enabled_at', label: 'Freigegeben', valuePath: 'enabled_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => {
            return {
                text: value ? dayjs(value).fromNow() : 'Ausstehend',
                tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : 'Ausstehend',
                icon: value ? 'check' : 'close',
                color: value ? 'var(--color-success)' : 'var(--color-error)',
            }
        }},
        { name: 'has_tfa_enabled', label: 'Zweiter Faktor', valuePath: 'has_tfa_enabled', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: boolean | null, item: any) => {
            return { text: value ? 'Aktiv' : 'Inaktiv', icon: value ? 'check' : 'close', color: value ? 'var(--color-success)' : 'var(--color-error)', }
        }},
        { name: 'created_at', label: 'Registriert', valuePath: 'created_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) : null },
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
        // {
        //     icon: 'content_copy',
        //     text: 'Duplizieren',
        //     color: 'var(--color-text)',
        //     individual: true,
        //     multiple: false,
        //     triggerOnRowClick: false,
        //     isAvailable: () => true,
        //     run: (items: (number | string)[]) => IPM.duplicate(items[0]),
        // },
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

    const tableFilters = ref<FilterSetting[]>([
        {
            name: 'roles',
            label: 'Rollen',
            type: 'select',
            multiple: true,
            values: computed(() => IPM.availableFilterValues['roles']?.map((item: any) => ({ value: item, text: item })) || []),
        },
        {
            name: 'permission_levels',
            label: 'Berechtigungslevel',
            type: 'select',
            multiple: true,
            values: [
                { value: 'admin', text: 'Admin' },
                { value: 'elevated', text: 'Erweitert' },
            ],
        },
        {
            name: 'email_verified',
            label: 'Email bestätigt',
            type: 'select',
            multiple: false,
            values: [
                { value: 'pending', text: 'Ausstehend' },
                { value: 'active', text: 'Bestätigt' },
            ],
        },
        {
            name: 'enabled',
            label: 'Freigegeben',
            type: 'select',
            multiple: false,
            values: [
                { value: 'pending', text: 'Ausstehend' },
                { value: 'active', text: 'Freigegeben' },
            ],
        },
        {
            name: 'tfa_enabled',
            label: 'Zweiter Faktor',
            type: 'select',
            multiple: false,
            values: [
                { value: 'inactive', text: 'Inaktiv' },
                { value: 'active', text: 'Aktiv' },
            ],
        },
    ])



    // START: Import
    const importPopup = ref()
    const importFields = ref([
        new FieldGroup('Allgemeines', [
            new Field('username', 'Nutzername'),
            new Field('email', 'Email'),
            new Field('password', 'Passwort'),
            new Field('roles', 'Rollen'),
        ]),
        new FieldGroup('Vollständiger Name', [
            new Field('user_name_salutation', 'Anrede'),
            new Field('user_name_prefix', 'Titel'),
            new Field('user_name_firstname', 'Vorname'),
            new Field('user_name_middlename', 'Zweiter Vorname'),
            new Field('user_name_lastname', 'Nachname'),
            new Field('user_name_suffix', 'Suffix'),
            new Field('user_name_legalname', 'Rechtlicher Name'),
            new Field('user_name_nickname', 'Spitzname'),
        ]),
        new FieldGroup('Organisation', [
            new Field('user_company_company', 'Organisation'),
            new Field('user_company_department', 'Abteilung'),
            new Field('user_company_title', 'Position'),
        ]),
    ])

    async function importUsers(data: any[])
    {
        await useAxios().post('/api/users/import', {items: data})
        toast.success('Nutzer wurden importiert')
        IPM.fetch()
    }
    // END: Import
</script>

<style lang="sass" scoped></style>
