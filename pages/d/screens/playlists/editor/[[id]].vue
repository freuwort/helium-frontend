<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Screen Playlist Editor" color="#84cc16">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/d/screens/playlists"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodSelect label="Typ" v-model="form.model.type" :options="type_options"/>
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
    
    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_screen_playlists_show'

    

    // Params
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            name: '',
            type: 'playlist',
            screen_order: [],
            owner: null,
            created_at: '',
            updated_at: '',
        },
    })



    // Options
    const type_options = [
        { value: 'playlist', text: 'Playlist' },
    ]



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/screens/playlists/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/screens/playlists'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Playlist wurde erstellt')
                navigateTo(apiRoute('/d/screens/playlists/editor/:id', { id: response.value?.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/screens/playlists/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Playlist wurde aktualisiert')
            },
        })
    }
    // END: Server routes



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
