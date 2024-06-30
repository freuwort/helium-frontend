<template>
    <NuxtLayout limiter="medium" name="auth-default" :pageTitle="id ? 'Kategorie bearbeiten' : 'Kategorie erstellen'" color="#F59E0B">
        <HeCard is="form" @submit.prevent="save">
            <HeFlex class="rounded-t-2xl border-b sticky top-16 z-20 bg-background" horizontal padding="1rem 2rem">
                <IodButton type="button" label="Zur Übersicht" :loading="form.processing" variant="contained" @click="navigateTo('/d/content/categories')"/>
                <HeSpacer />
                <IodButton type="submit" label="Speichern" :loading="form.processing" variant="filled" />
            </HeFlex>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <div class="flex items-center gap-4">
                        <IconColorPicker hasColor hasIcon v-model:color="form.model.color" v-model:icon="form.model.icon"/>
                        <IodInput class="flex-1" label="Name" v-model="form.model.name" @input="form.model.slug = slugify(form.model.name)"/>
                    </div>
                    <IodInput label="Slug" v-model="form.model.slug">
                        <template #right>
                            <IodIconButton type="button" icon="auto_awesome" v-tooltip="'Automatisch generieren'" size="s" variant="text" @click="form.model.slug = slugify(form.model.name)"/>
                        </template>
                    </IodInput>
                    <IodInput label="Übergeordnete Kategorie" v-model="form.model.parent_id"/>

                    <TextEditor v-model="form.model.content" label="Beschreibung" />
                </HeFlex>
                
                
                
                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Zugriffsrechte</h5>
                    <IodInput label="Besitzer" v-model="form.model.owner_id"/>
                    <IodButton type="button" label="Zugriffsrechte bearbeiten" variant="contained" @click="sharePopup.open()"/>
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

    

    // Params
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            parent_id: null,
            inherit_access: false,
            owner_id: null,
            owner: null,
            type: 'post',
            name: '',
            slug: '',
            content: '',
            icon: 'category',
            color: '#363E40',
            hidden: false,
            created_at: '',
            updated_at: '',
        },
        accesses: [],
    })
    
    
    
    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/categories/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/categories'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Kategorie wurde erstellt')
                navigateTo(apiRoute('/d/content/categories/editor/:id', {
                    id: response.value?.data?.id
                }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/categories/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Kategorie wurde aktualisiert')
            },
        })
    }
    // END: Server routes



    // START: Share
    const sharePopup = ref()
    // END: Share



    // Fetch model
    if (id.value) fetch()
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
        gap: 2rem

    .entity-card
        display: flex
        flex-direction: column
        align-items: stretch
        overflow: hidden
        box-shadow: none !important

        .entity-card-head
            position: relative
            height: 10rem
            background: var(--color-background-soft)

        .iod-button
            position: absolute
            top: 1rem
            right: 1rem

        .iod-icon
            font-size: 4rem
</style>
