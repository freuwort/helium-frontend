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
                        <VDropdown :distance="6" placement="bottom-start">
                            <IodIconButton type="button" :icon="form.icon" size="l" corner="pill" variant="contained" :background="form.color" v-tooltip.bottom="'Farbe und Icon wählen'" />
                            <template #popper>
                                <HeFlex :padding="1">
                                    <ContextMenuLabel label="Farben" style="padding: 0;"/>
                                    <HeFlex horizontal wrap class="w-80">
                                        <IodIconButton type="button" v-for="color in color_options" corner="pill" icon="radio_button_unchecked" :style="'--local-color-background:' + color" :variant="form.color == color ? 'contained' : 'text'" @click="form.color = color"/>
                                    </HeFlex>
                                    <ContextMenuLabel label="Icons" style="padding: 0; padding-top: 1rem"/>
                                    <HeFlex horizontal wrap class="w-80">
                                        <IodIconButton type="button" v-for="icon in icon_options" corner="pill" :icon="icon" :style="'--local-color-background:' + form.color" :variant="form.icon == icon ? 'contained' : 'text'" @click="form.icon = icon"/>
                                    </HeFlex>
                                </HeFlex>
                            </template>
                        </VDropdown>
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

    const icon_options = [
        'category',
        'label',
        'person',
        'shield',
        'verified_user',
        'shopping_cart',
        'store',
        'work',

        'star',
        'favorite',
        'home',
        'pets',
        'school',
        'build',
        'local_shipping',
        'dns',
    ]

    const color_options = [
        'rgb(34 197 94)',
        'rgb(245 158 11)',
        'rgb(249 115 22)',
        'rgb(244 63 94)',
        'rgb(168 85 247)',
        'rgb(99 102 241)',
        'rgb(59 130 246)',
        'rgb(51 65 85)',

        'rgb(74 222 128)',
        'rgb(251 191 36)',
        'rgb(251 146 60)',
        'rgb(251 113 133)',
        'rgb(192 132 252)',
        'rgb(129 140 248)',
        'rgb(96 165 250)',
        'rgb(100 116 139)',
    ]



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
