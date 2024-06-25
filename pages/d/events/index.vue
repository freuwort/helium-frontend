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
                    <IodButton type="button" label="Neues Event" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>
            </IodTable>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { transform } from 'lodash';

    const dayjs = useDayjs()
    
    definePageMeta({
        middleware: 'auth',
    })



    const IPM = useItemPageManager({
        pageTitle: 'Events Verwaltung',
        scope: 'admin.events.index',
        routes: {
            fetch: '/api/events/',
            duplicate: '/api/events/:id/duplicate',
            delete: '/api/events/',
            editor: '/d/events/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'slug', label: 'Slug', valuePath: 'slug', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'invites_count', label: 'Einladungen', valuePath: 'invites_count', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: number | null) => (value || 0).toString() },
        { name: 'start_at', label: 'Anfangsdatum', valuePath: 'start_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: toLocalDate(value, 'DD.MM.YYYY'), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
        { name: 'end_at', label: 'Enddatum', valuePath: 'end_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: toLocalDate(value, 'DD.MM.YYYY'), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
        { name: 'created_at', label: 'Erstellt', valuePath: 'created_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
        { name: 'updated_at', label: 'Zuletzt geändert', valuePath: 'updated_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) => value ? ({ text: dayjs(value).fromNow(), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
    ]

    const tableActions = [
        {
            icon: 'forward_to_inbox',
            text: 'Einladungen verwalten',
            color: 'var(--color-text)',
            individual: true,
            multiple: false,
            triggerOnRowClick: false,
            isAvailable: () => true,
            run: (items: (number | string)[]) => navigateTo(`/d/events/${items[0]}/invites`),
        },
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

    const tableFilters = [] as any[]
</script>

<style lang="sass" scoped></style>
