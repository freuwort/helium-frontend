<template>
    <NuxtLayout name="auth-default" :scope :pageTitle="IPM.options.pageTitle" color="#F59E0B">
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
                    <IodButton type="button" label="Neuer Beitrag" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>
            </IodTable>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { FilterSetting } from '~/components/Iod/IodTable.vue'

    const dayjs = useDayjs()
    const scope = 'view_admin_content_posts_index'
    
    definePageMeta({
        middleware: 'auth',
    })



    const IPM = useItemPageManager({
        scope,
        pageTitle: 'Beitrags Verwaltung',
        routes: {
            fetch: '/api/content/posts/',
            duplicate: '/api/content/posts/:id/duplicate',
            delete: '/api/content/posts/',
            editor: '/d/content/posts/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'id', label: 'ID', valuePath: 'id', sortable: true, width: 70, resizeable: true, hideable: true, default: '-'},
        { name: 'space.name', label: 'Space', valuePath: 'space.name', sortable: false, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'draft.name', label: 'Name', valuePath: 'draft.name', sortable: false, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'draft.slug', label: 'Slug', valuePath: 'draft.slug', sortable: false, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'owner', label: 'Besitzer', valuePath: 'owner', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => {
            if (!value) return '-'
            return {
                text: item.owner.name || '-',
                tooltip: item.owner.name,
                image: item.owner.profile_image,
                icon: 'person',
            }
        }},
        { name: 'hidden', label: 'Wird angezeigt', valuePath: 'hidden', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: boolean) => {
            return {
                text: value ? 'Versteckt' : 'Angezeigt',
                color: value ? 'var(--color-error)' : 'var(--color-success)',
                icon: value ? 'visibility_off' : 'visibility',
            }
        }},
        { name: 'draft.review_ready', label: 'Überprüfung', valuePath: 'draft.review_ready', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: boolean) => {
            return {
                text: value ? 'Ausstehend' : 'Nicht bereit',
                color: value ? 'var(--color-warning)' : 'var(--color-error)',
                icon: value ? 'pace' : 'block',
            }
        }},
        { name: 'draft.created_at', label: 'Erstellt', valuePath: 'draft.created_at', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
        { name: 'draft.updated_at', label: 'Zuletzt geändert', valuePath: 'draft.updated_at', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) => value ? ({ text: dayjs(value).fromNow(), tooltip: toLocalDate(value, 'DD.MM.YYYY HH:mm') }) : null },
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
            name: 'hidden',
            label: 'Wird angezeigt',
            type: 'select',
            multiple: false,
            values: [
                { value: 'shown', text: 'Angezeigt' },
                { value: 'hidden', text: 'Versteckt' },
            ],
        },
        {
            name: 'review_ready',
            label: 'Überprüfung',
            type: 'select',
            multiple: false,
            values: [
                { value: 'ready', text: 'Ausstehend' },
                { value: 'not_ready', text: 'Nicht bereit' },
            ],
        },
        {
            name: 'space',
            label: 'Space',
            type: 'select',
            multiple: true,
            values: computed(() => IPM.availableFilterValues['space']?.map((item: any) => ({ value: item.id, text: item.name })) || []),
        },
    ])
</script>

<style lang="sass" scoped></style>
