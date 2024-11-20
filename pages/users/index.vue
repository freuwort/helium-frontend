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
                    <IodButton :is="NuxtLink" label="Neuer Nutzer" corner="pill" icon-right="add" to="/users/editor"/>
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
    import { FieldGroup, Field } from '~/classes/import/CsvImport'
    import TableColumnBuilder from '~/classes/Builder/TableColumnBuilder'
    import { toast } from 'vue3-toastify'
    
    const dayjs = useDayjs()
    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_users_index'



    const IPM = useItemPageManager({
        scope,
        pageTitle: 'Nutzer Verwaltung',
        routes: {
            fetch: '/api/users',
            duplicate: '/api/users/:id/duplicate',
            delete: '/api/users',
            restore: '/api/users/restore',
            forceDelete: '/api/users/force',
        },
    })
    
    const tableColumnBuilder = new TableColumnBuilder()
    const tableColumns = [
        tableColumnBuilder.new().name('id').label('ID').width(70).build(),
        tableColumnBuilder.new().name('name').label('Name').transform((value: string | null, item: any) => ({
            text: value || '-',
            tooltip: value || '-',
            image: item.avatar,
            icon: 'person',
        })).build(),
        tableColumnBuilder.new().name('customer_id').label('Kunden-Nr.').build(),
        tableColumnBuilder.new().name('employee_id').label('Personal-Nr.').build(),
        tableColumnBuilder.new().name('member_id').label('Mitglieds-Nr.').build(),
        tableColumnBuilder.new().name('username').label('Nutzername').build(),
        tableColumnBuilder.new().name('email').label('Email').build(),
        tableColumnBuilder.new().name('phone').label('Telefon').build(),
        tableColumnBuilder.new().name('main_address').label('Hauptadresse').sortable(false).transform((value: any) => stringFromAddress(value) || null).build(),
        tableColumnBuilder.new().name('billing_address').label('Rechnungsadresse').sortable(false).transform((value: any) => stringFromAddress(value) || null).build(),
        tableColumnBuilder.new().name('shipping_address').label('Lieferadresse').sortable(false).transform((value: any) => stringFromAddress(value) || null).build(),
        tableColumnBuilder.new().name('roles').label('Rollen').transform((value: any[]) => value?.map(e => e.name)?.join(', ') || null).build(),
        tableColumnBuilder.new().name('is_admin').label('Berechtigungslevel').sortable(false).transform((value: boolean | null, item: any) => {
            if (item?.is_admin) return { text: 'Admin', icon: 'shield', color: 'var(--color-info)', }
            if (item?.has_elevated_permissions) return { text: 'Erweitert', icon: 'check_circle', color: 'var(--color-info)', }
            return { text: 'Basis', icon: 'key', color: 'var(--color-text-soft)', }
        }).build(),
        tableColumnBuilder.new().name('email_verified_at').label('Email bestätigt').transform((value: string | null) => ({
            text: value ? dayjs(value).fromNow() : 'Ausstehend',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : 'Ausstehend',
            icon: value ? 'check' : 'close',
            color: value ? 'var(--color-success)' : 'var(--color-error)',
        })).build(),
        tableColumnBuilder.new().name('phone_verified_at').label('Telefon bestätigt').transform((value: string | null, item: any) => ({
            text: value ? dayjs(value).fromNow() : 'Ausstehend',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : 'Ausstehend',
            icon: value ? 'check' : 'close',
            color: value ? 'var(--color-success)' : 'var(--color-error)',
        })).build(),
        tableColumnBuilder.new().name('enabled_at').label('Freigegeben').transform((value: string | null, item: any) => ({
            text: value ? dayjs(value).fromNow() : 'Ausstehend',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : 'Ausstehend',
            icon: value ? 'check' : 'close',
            color: value ? 'var(--color-success)' : 'var(--color-error)',
        })).build(),
        tableColumnBuilder.new().name('blocked_at').label('Gesperrt').transform((value: string | null, item: any) => ({
            text: value ? dayjs(value).fromNow() : 'Aktiv',
            tooltip: value ? `${dayjs(value).format('DD.MM.YYYY HH:mm')} - Grund: ${item.block_reason || 'Nicht angegeben'}` : 'Nein',
            icon: value ? 'do_not_disturb_on' : '',
            color: value ? 'var(--color-error)' : 'var(--color-info)',
        })).build(),
        tableColumnBuilder.new().name('has_tfa_enabled').label('Zweiter Faktor').transform((value: boolean | null, item: any) => ({
            text: value ? 'Aktiv' : 'Inaktiv',
            tooltip: value ? 'Aktiv' : 'Inaktiv',
            icon: value ? 'check' : 'close',
            color: value ? 'var(--color-success)' : 'var(--color-error)',
        })).build(),
        tableColumnBuilder.new().name('last_login_at').label('Zuletzt eingeloggt').transform((value: string | null) => ({
            text: value ? dayjs(value).fromNow() : 'Nie',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : 'Nie',
        })).build(),
        tableColumnBuilder.new().name('created_at').label('Registriert').transform((value: string | null) => ({
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
            run: (items: (number | string)[]) => navigateTo(`/users/editor/${items[0]}`), //IPM.open(items[0]),
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
        {
            icon: 'delete_forever',
            text: 'Endgültig löschen',
            color: 'var(--color-error)',
            individual: false,
            multiple: true,
            triggerOnRowClick: false,
            isAvailable: () => true,
            run: (items: (number | string)[]) => IPM.forceDelete(items),
        },
        {
            icon: 'restore_from_trash',
            text: 'Wiederherstellen',
            color: 'var(--color-text)',
            individual: false,
            multiple: true,
            triggerOnRowClick: false,
            isAvailable: () => true,
            run: (items: (number | string)[]) => IPM.restore(items),
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
        {
            name: 'deleted',
            label: 'Gelöscht',
            type: 'select',
            multiple: false,
            values: [
                { value: 'deleted', text: 'Ja' },
            ],
        }
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
