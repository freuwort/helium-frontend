<template>
    <NuxtLayout name="auth-default" :pageTitle="IPM.options.pageTitle" color="var(--color-primary)">
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
                    <IodButton type="button" label="Neue Rolle" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>
            </IodTable>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })



    const dayjs = useDayjs()

    const IPM = useItemPageManager({
        pageTitle: 'Rollen Verwaltung',
        scope: 'admin.roles.index',
        routes: {
            fetch: '/api/roles/',
            duplicate: '/api/roles/:id/duplicate',
            delete: '/api/roles/',
            editor: '/d/roles/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => {
            return {
                text: item.name || '-',
                tooltip: item.name,
                icon: item.icon || 'category',
                color: item.color || 'var(--color-primary)',
            }
        }},
        { name: 'permissions', label: 'Berechtigungen', valuePath: 'permissions', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string[] | null) => {
            return {
                text: value ? value.join(', ') || '-' : '-',
                tooltip: value?.join(', '),
            }
        }},
        { name: 'created_at', label: 'Erstellt', valuePath: 'created_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) : null },
        { name: 'updated_at', label: 'Aktualisiert', valuePath: 'updated_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) : null },
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
</script>

<style lang="sass" scoped></style>
