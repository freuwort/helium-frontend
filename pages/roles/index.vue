<template>
    <NuxtLayout name="auth-default" :scope :pageTitle="IPM.options.pageTitle">
        <IodTable
            class="p-4 w-full h-full"
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
                <IodButton type="button" label="Neue Rolle" corner="m" size="s" icon-right="add" @click="roleEditor.open()"/>
            </template>
        </IodTable>

        <DialogRoleEditor ref="roleEditor" @change="IPM.fetch()"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { FilterSetting } from '~/components/Iod/IodTable.vue'
    import TableColumnBuilder from '~/classes/Builder/TableColumnBuilder'
    
    const dayjs = useDayjs()
    const scope = 'view_admin_roles_index'



    const roleEditor = ref()
    const IPM = useItemPageManager({
        scope,
        pageTitle: 'Rollen Verwaltung',
        routes: {
            fetch: '/api/roles',
            duplicate: '/api/roles/:id/duplicate',
            delete: '/api/roles',
            editor: '/roles/editor/:id',
        },
    })

    const tableColumnBuilder = new TableColumnBuilder()
    const tableColumns = [
        tableColumnBuilder.new().name('id').label('ID').width(70).build(),
        tableColumnBuilder.new().name('name').label('Name').transform((value: string | null, item: any) => ({ text: item.name, icon: item.icon, color: item.color })).build(),
        tableColumnBuilder.new().name('permissions').label('Berechtigungen').sortable(false).transform((value: string[] | null) => value?.join(', ') || null).build(),
        tableColumnBuilder.new().name('is_admin').label('Berechtigungslevel').sortable(false).transform((value: boolean | null, item: any) => {
            if (item.is_admin) return { text: 'Admin', icon: 'verified_user', color: 'var(--color-error)', }
            if (item.has_elevated_permissions) return { text: 'Erweitert', icon: 'shield', color: 'var(--color-error)', }
            return { text: 'Basis', icon: 'key', color: 'var(--color-text-soft)', }
        }).build(),
        tableColumnBuilder.new().name('uses_user').label('Nutzer').sortable(false).width(100).transform((value: any) => ({icon: 'person', text: value?.users || '0'})).build(),
        tableColumnBuilder.new().name('uses_accesses').label('Freigaben').sortable(false).width(100).transform((value: any) => ({icon: 'share', text: value?.accesses || '0'})).build(),
        tableColumnBuilder.new().name('created_at').label('Erstellt').transform((value: string | null) => ({
            text: value ? dayjs(value).fromNow() : '-',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-',
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
        {
            icon: 'edit',
            text: 'Bearbeiten',
            scope: ['individual', 'row'],
            run: (context: string, items: any) => roleEditor.value.open(items[0]),
        },
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
            color: 'error',
            scope: ['selection', 'individual'],
            run: (context: string, items: any) => IPM.delete(items),
        },
    ]

    const tableFilters = ref<FilterSetting[]>([
        {
            name: 'permissions',
            label: 'Berechtigungen',
            type: 'select',
            multiple: true,
            values: computed(() => IPM.availableFilterValues['permission']?.map((item: any) => ({ value: item, text: item })) || []),
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
    ])
</script>

<style lang="sass" scoped></style>
