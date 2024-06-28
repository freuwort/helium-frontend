<template>
    <NuxtLayout limiter="medium" name="auth-default" :pageTitle="id ? 'Space bearbeiten' : 'Space erstellen'" color="#F59E0B">
        <HeCard is="form" @submit.prevent="save">
            <HeFlex class="rounded-t-2xl border-b sticky top-16 z-20 bg-background" horizontal padding="1rem 2rem">
                <IodButton type="button" label="Zur Übersicht" :loading="form.processing" variant="contained" @click="navigateTo('/d/content/spaces/')"/>
                <HeSpacer />
                <IodButton type="submit" label="Speichern" :loading="form.processing" variant="filled" />
            </HeFlex>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodInput label="Übergeordneter Space" v-model="form.model.parent_id"/>
                    <IodInput label="Besitzer" v-model="form.model.owner_id"/>
                </HeFlex>



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Zugriffsrechte</h5>
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
            name: '',
            created_at: '',
            updated_at: '',
        },
        accesses: [],
    })
    
    
    
    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/content/spaces/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/content/spaces'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Space wurde erstellt')
                navigateTo(apiRoute('/d/content/spaces/editor/:id', {
                    id: response.value?.data?.id
                }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/content/spaces/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Space wurde aktualisiert')
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
