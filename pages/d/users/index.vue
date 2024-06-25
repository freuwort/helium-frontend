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
                    <IodButton type="button" label="Neuer Nutzer" corner="pill" icon-right="add" @click="IPM.open()"/>
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
        pageTitle: 'Nutzer Verwaltung',
        scope: 'admin.users.index',
        routes: {
            fetch: '/api/users/',
            duplicate: '/api/users/:id/duplicate',
            delete: '/api/users/',
            editor: '/d/users/editor/:id',
        },
    })

    const tableColumns = [
        { name: 'name', label: 'Name', valuePath: 'name', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null, item: any) => {
            return {
                text: item.fullname || '-',
                tooltip: item.fullname,
                image: item.profile_image,
                icon: 'person',
            }
        }},
        // roles
        { name: 'roles', label: 'Rollen', valuePath: 'roles', sortable: false, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: any[]) =>  value.length ? (value.map(e => e.name).join(', ')) : null },
        { name: 'username', label: 'Nutzername', valuePath: 'username', sortable: true, width: 200, resizeable: true, hideable: true, default: '-'},
        { name: 'email', label: 'Email', valuePath: 'email', sortable: true, width: 200, resizeable: true, hideable: true, default: '-' },
        { name: 'created_at', label: 'Registriert', valuePath: 'created_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) =>  value ? ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) : null },
        { name: 'email_verified_at', label: 'Verifikation', valuePath: 'email_verified_at', sortable: true, width: 200, resizeable: true, hideable: true, default: '-', transform: (value: string | null) => value ? ({ text: dayjs(value).fromNow(), tooltip: dayjs(value).format('DD.MM.YYYY HH:mm') }) : null },
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
