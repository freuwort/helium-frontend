<template>
    <NuxtLayout name="auth-default" :scope :pageTitle="IPM.options.pageTitle" color="#06B6D4">
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
                    <IodButton type="button" label="Neues Formular" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>
            </IodTable>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { FilterSetting } from '~/components/Iod/IodTable.vue'
    
    const dayjs = useDayjs()
    const scope = 'view_admin_forms_index'



    const IPM = useItemPageManager({
        scope,
        pageTitle: 'Formulare Verwaltung',
        routes: {
            fetch: '/api/forms',
            duplicate: '/api/forms/:id/duplicate',
            delete: '/api/forms',
            editor: '/forms/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'slug', label: 'Slug', valuePath: 'slug', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'form_submissions_count', label: 'Einsendungen', valuePath: 'form_submissions_count', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: number | null) => (value || 0).toString() },
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

    const tableFilters = ref<FilterSetting[]>([])
</script>

<style lang="sass" scoped></style>
