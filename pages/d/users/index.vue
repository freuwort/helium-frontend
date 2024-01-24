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
                />
            </Card>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
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
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 300, resizeable: true, hideable: true},
        { name: 'username', label: 'Nutzername', valuePath: 'username', sortable: true, width: 150, resizeable: true, hideable: true, transform: (value: string | null) => value || '-'},
        { name: 'email', label: 'Email', valuePath: 'email', sortable: true, width: 250, resizeable: true, hideable: true, transform: (value: string | null) => value || '-' },
        { name: 'created_at', label: 'Registriert am', valuePath: 'created_at', sortable: true, width: 200, resizeable: true, hideable: true},
        { name: 'email_verified_at', label: 'Verifikation am', valuePath: 'email_verified_at', sortable: true, width: 200, resizeable: true, hideable: true},
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
