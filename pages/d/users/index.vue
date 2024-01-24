<template>
    <NuxtLayout name="auth-default" :pageTitle="IPM.options.pageTitle" color="var(--color-primary)">
        <div class="limiter">
            <Card>
                <IodTable
                    show-create
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
                        <IodButton label="Neuer Nutzer"/>
                    </template>
                </IodTable>
            </Card>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const dayjs = useDayjs()
    definePageMeta({
        middleware: 'auth',
    })



    const IPM = useItemPageManager({
        pageTitle: 'Nutzer Verwaltung',
        scope: 'admin.users.index',
        routes: {
            fetch: '/api/users/',
            editor: '/api/users/:id',
            duplicate: '/api/users/:id/duplicate',
            delete: '/api/users/:id',
        },
    })

    const tableColumns = [
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'username', label: 'Nutzername', valuePath: 'username', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'email', label: 'Email', valuePath: 'email', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'created_at', label: 'Registriert am', valuePath: 'created_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) },
        { name: 'email_verified_at', label: 'Verifikation am', valuePath: 'email_verified_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) => ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) },
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
            run: (items: (number | string)[]) => null,
        },
        {
            icon: 'content_copy',
            text: 'Duplizieren',
            color: 'var(--color-text)',
            individual: true,
            multiple: false,
            triggerOnRowClick: false,
            isAvailable: () => true,
            run: (items: (number | string)[]) => null,
        },
        {
            icon: 'delete',
            text: 'Löschen',
            color: 'var(--color-error)',
            individual: true,
            multiple: true,
            triggerOnRowClick: false,
            isAvailable: () => true,
            run: (items: (number | string)[]) => null,
        },
    ]

    const tableFilters = [] as any[]
</script>

<style lang="sass" scoped></style>
