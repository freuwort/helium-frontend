<template>
    <NuxtLayout limiter="medium" name="auth-default" :pageTitle="id ? 'Rolle bearbeiten' : 'Rolle erstellen'" color="var(--color-primary)">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 border-b sticky top-16 z-20 bg-background rounded-t-xl">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" :loading="form.processing" variant="contained" to="/d/roles"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <div class="flex flex-col p-4 gap-12">
                <ErrorAlert :errors="form.errors" />
    
                <div class="flex gap-4">
                    <IconColorPicker hasColor hasIcon v-model:color="form.color" v-model:icon="form.icon"/>
                    <IodInput class="flex-1" label="Name" v-model="form.name"/>
                </div>
    
                <div class="flex flex-col gap-4 mb-4" v-for="app in permissions.all">
                    <h6 class="m-0 font-medium">{{ app.title }}</h6>
                    
                    <div class="flex flex-col" v-for="group in app.permissions">
                        <IodToggle v-for="permission in group" :key="permission.name" :modelValue="form.permissions.includes(permission.name)" @update:modelValue="togglePermission(permission.name)">
                            <template #label>
                                <div class="flex flex-col gap-1 text-sm">
                                    <span class="font-heading color-text font-medium">{{ permission.label }}</span>
                                    <small>{{ permission.description }}</small>
                                </div>
                            </template>
                        </IodToggle>
                    </div>
                </div>
            </div>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    definePageMeta({
        middleware: 'auth',
    })

    const NuxtLink = defineNuxtLink({})



    // Item id
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        name: '',
        color: '#363E40',
        icon: 'category',
        created_at: '',
        updated_at: '',
        permissions: [],
    })

    const permissions = useForm({
        all: [],
    })



    // Toggle permission
    function togglePermission(permission: string)
    {
        if (form.permissions.includes(permission))
        {
            form.permissions = form.permissions.filter((p: string) => p != permission)
        }
        else
        {
            form.permissions.push(permission)
        }
    }



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/roles/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value.data).reset()
            },
        })
    }

    function store()
    {
        form.post(apiRoute('/api/roles'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Rolle wurde erstellt')
                navigateTo(apiRoute('/d/roles/editor/:id', { id: response.value?.data?.id }))
            },
        })
    }

    function update()
    {
        form.patch(apiRoute('/api/roles/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value.data).reset()
                toast.success('Rolle wurde aktualisiert')
            },
        })
    }
    // END: Server routes

    // Initial fetch
    if (id.value) fetch()

    permissions.get(apiRoute('/api/permissions'), {
        onSuccess(response: any)
        {
            permissions.defaults({all: response.value.data}).reset()
        },
    })
</script>

<style lang="sass" scoped>
</style>
