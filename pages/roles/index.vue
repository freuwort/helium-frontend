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
                    <IodButton type="button" label="Neue Rolle" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>
            </IodTable>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { FilterSetting } from '~/components/Iod/IodTable.vue'
    
    const dayjs = useDayjs()
    const scope = 'view_admin_roles_index'



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

    const tableColumns = [
        { name: 'id', label: 'ID', valuePath: 'id', sortable: true, width: 70, resizable: true, hideable: true, default: '-', },
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => ({ text: item.name, icon: item.icon, color: item.color }), },
        { name: 'permissions', label: 'Berechtigungen', valuePath: 'permissions', sortable: false, width: 200, resizable: true, hideable: true, default: '-', transform: (value: string[] | null) => value?.join(', ') || null, },
        { name: 'is_admin', label: 'Berechtigungslevel', valuePath: 'is_admin', sortable: false, width: 200, resizable: true, hideable: true, default: '-', transform: (value: boolean | null, item: any) => {
            if (item.is_admin) return { text: 'Admin', icon: 'shield', color: 'var(--color-info)', }
            if (item.has_elevated_permissions) return { text: 'Erweitert', icon: 'check_circle', color: 'var(--color-info)', }
            return { text: 'Basis', icon: 'key', color: 'var(--color-text-soft)', }
        }},
        { name: 'uses', label: 'Verwendungen', valuePath: 'uses', sortable: false, width: 200, resizable: true, hideable: true, monospace: true, default: '-', transform: (value: any) => {
            return `${value?.users} Nutzer, ${value?.accesses} Freigaben`
        }},
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
        {
            icon: 'edit',
            text: 'Bearbeiten',
            scope: ['individual', 'row'],
            run: (context: string, items: any) => navigateTo(`/users/editor/${items[0]}`),
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
            color: 'var(--color-error)',
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
