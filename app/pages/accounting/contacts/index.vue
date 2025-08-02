<template>
    <NuxtLayout name="auth-default" :scope :pageTitle="IPM.options.pageTitle" color="#FF4757">
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
                    <IodButton type="button" label="Neuer Kontakt" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>

                <template #wrapped-right>
                    <IodIconButton type="button" size="s" corner="pill" variant="text" icon="cloud_upload" @click="importPopup.select()" v-tooltip="'Importieren'"/>
                    <!-- <IodIconButton type="button" size="s" corner="pill" variant="text" icon="file_save" @click="true" v-tooltip="'Exportieren'"/> -->
                    <!-- <IodIconButton type="button" size="s" corner="pill" variant="text" icon="stacked_email" @click="sendEmailPopup.open(IPM.keys)" v-tooltip="'Massenmail versenden'"/> -->
                </template>
            </IodTable>
        </HeCard>

        <DialogImportCsv ref="importPopup" :fields="importFields" @import="importUsers" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { FilterSetting } from '~/components/Iod/IodTable.vue'
    import { FieldGroup, Field } from '~~/classes/import/CsvImport'
    import TableColumnBuilder from '~~/classes/Builder/TableColumnBuilder'
    import { toast } from 'vue3-toastify'
    
    const dayjs = useDayjs()
    const scope = 'view_admin_accounting_contact_index'



    const IPM = useItemPageManager({
        scope,
        pageTitle: 'Kontakte Verwaltung',
        routes: {
            fetch: '/api/accounting/contacts',
            duplicate: '/api/accounting/contacts/:id/duplicate',
            delete: '/api/accounting/contacts',
            editor: '/accounting/contacts/editor/:id',
        },
    })
    
    const tableColumnBuilder = new TableColumnBuilder()
    const tableColumns = [
        tableColumnBuilder.new().name('id').label('ID').width(70).build(),
        tableColumnBuilder.new().name('type').label('Typ').build(),
        tableColumnBuilder.new().name('name').label('Name').build(),
        tableColumnBuilder.new().name('vat_id').label('USt-IdNr.').build(),
        tableColumnBuilder.new().name('tax_id').label('Steuernummer').build(),
        tableColumnBuilder.new().name('customer_id').label('Kunden-Nr.').build(),
        tableColumnBuilder.new().name('supplier_id').label('Lieferanten-Nr.').build(),
        tableColumnBuilder.new().name('employee_id').label('Personal-Nr.').build(),
        tableColumnBuilder.new().name('created_at').label('Erstellt').transform((value: string | null) => ({
            text: value ? dayjs(value).fromNow() : '-',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-',
        })).build(),
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
