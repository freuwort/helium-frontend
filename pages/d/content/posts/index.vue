<template>
    <NuxtLayout name="auth-default" :pageTitle="IPM.options.pageTitle" color="#F59E0B">
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
                    <IodButton type="button" label="Neuer Beitrag" corner="pill" icon-right="add" @click="IPM.open()"/>
                </template>
            </IodTable>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const dayjs = useDayjs()
    
    definePageMeta({
        middleware: 'auth',
    })



    const IPM = useItemPageManager({
        pageTitle: 'Beitrags Verwaltung',
        scope: 'admin.content.posts.index',
        routes: {
            fetch: '/api/content/posts/',
            duplicate: '/api/content/posts/:id/duplicate',
            delete: '/api/content/posts/',
            editor: '/d/content/posts/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'id', label: 'ID', valuePath: 'id', sortable: true, width: 70, resizeable: true, hideable: true, default: '-'},
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'slug', label: 'Slug', valuePath: 'slug', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
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

    const tableFilters = ref([])
</script>

<style lang="sass" scoped></style>
