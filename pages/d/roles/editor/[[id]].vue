<template>
    <NuxtLayout limiter="text" name="auth-default" :pageTitle="id ? 'Rolle bearbeiten' : 'Rolle erstellen'" color="var(--color-primary)">
        <HeCard is="form" @submit.prevent="save">
            <HeFlex class="border-b" horizontal padding="1rem 2rem">
                <IodButton type="button" label="Zur Übersicht" :loading="form.processing" variant="contained" @click="navigateTo('/d/roles')"/>
                <HeSpacer />
                <IodButton type="submit" label="Speichern" :loading="form.processing" variant="filled" />
            </HeFlex>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />

                <HeFlex :gap="1">
                    <HeFlex horizontal :gap="1">
                        <VDropdown :distance="6">
                            <button type="button" class="color-button" :style="{background: form.color}" v-tooltip.bottom="'Farbe und Icon wählen'">
                                <IodIcon :icon="form.icon" />
                            </button>
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
        '#363E40', '#f39c12', '#ff6348', '#ff4757', '#8e44ad', '#3742fa', '#1e90ff', '#2ed573',
        '#57606f', '#f1c40f', '#ff7f50', '#ff6b81', '#9b59b6', '#5352ed', '#70a1ff', '#7bed9f',
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
    .color-button
        width: 3rem
        height: 3rem
        border-radius: 50%
        background: var(--color-background-soft)
        cursor: pointer
        position: relative

        &::after
            content: ''
            position: absolute
            top: 0
            left: 0
            bottom: 0
            right: 0
            border-radius: inherit
            pointer-events: none
            border: 4px solid var(--color-background)
            opacity: .5

        .iod-icon
            width: 100%
            height: 100%
            font-size: 1.5rem
            color: white
</style>
