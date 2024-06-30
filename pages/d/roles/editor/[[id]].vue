<template>
    <NuxtLayout limiter="medium" name="auth-default" :pageTitle="id ? 'Rolle bearbeiten' : 'Rolle erstellen'" color="var(--color-primary)">
        <HeCard is="form" @submit.prevent="save">
            <HeFlex class="border-b sticky top-16 z-20 bg-background rounded-t-xl" horizontal padding="1rem 2rem">
                <IodButton type="button" label="Zur Übersicht" :loading="form.processing" variant="contained" @click="navigateTo('/d/roles')"/>
                <HeSpacer />
                <IodButton type="submit" label="Speichern" :loading="form.processing" variant="filled" />
            </HeFlex>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />

                <HeFlex :gap="1">
                    <HeFlex horizontal :gap="1">
                        <IconColorPicker hasColor hasIcon v-model:color="form.color" v-model:icon="form.icon"/>
                        <IodInput class="flex-1" label="Name" v-model="form.name"/>
                    </HeFlex>
                </HeFlex>

                <HeFlex :gap="1">
                    <HeFlex :gap="1" v-for="app in permissions.all">
                        <h6 class="m-0 font-medium">{{ app.title }}</h6>
                        <HeFlex :gap="1">
                            <HeFlex v-for="group in app.permissions">
                                <IodToggle v-for="permission in group" :key="permission.name" :modelValue="form.permissions.includes(permission.name)" @update:modelValue="togglePermission(permission.name)">
                                    <template #label>
                                        <HeFlex :gap=".25" style="font-size: 0.875rem">
                                            <span class="font-heading color-text font-medium">{{ permission.label }}</span>
                                            <small>{{ permission.description }}</small>
                                        </HeFlex>
                                    </template>
                                </IodToggle>
                            </HeFlex>
                        </HeFlex>
                    </HeFlex>
                </HeFlex>
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    definePageMeta({
        middleware: 'auth',
    })



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
