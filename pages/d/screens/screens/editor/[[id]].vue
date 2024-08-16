<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Screen Editor" color="#84cc16">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/d/screens/screens"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodInput label="Hintergrund" v-model="form.model.background"/>
                    <IodInput type="number" label="Dauer" min="0" v-model="form.model.duration"/>
                    <div class="flex items-center gap-4">
                        <IodInput type="number" class="flex-1" label="Breite" min="0" v-model="form.model.width"/>
                        <IodIcon icon="close"/>
                        <IodInput type="number" class="flex-1" label="Höhe" min="0" v-model="form.model.height"/>
                        <IodButtonGroup corner="pill">
                            <IodIconButton type="button" icon="crop_16_9" variant="contained" @click="setCanvas(1920, 1080)"/>
                            <IodIconButton type="button" icon="crop_3_2" variant="contained" @click="setCanvas(1440, 1080)"/>
                            <IodIconButton type="button" icon="crop_square" variant="contained" @click="setCanvas(1080, 1080)"/>
                            <IodIconButton type="button" icon="crop_rotate" variant="contained" @click="flipCanvas()"/>
                        </IodButtonGroup>
                    </div>
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
    const scope = 'view_admin_screen_screens_show'

    

    // Params
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            owner: null,
            name: '',
            content: null,
            background: '',
            width: 0,
            height: 0,
            duration: 0,
            created_at: '',
            updated_at: '',
        },
    })



    function setCanvas(width: number, height: number)
    {
        form.model.width = width
        form.model.height = height
    }

    function flipCanvas()
    {
        let width = form.model.width
        let height = form.model.height

        form.model.width = height
        form.model.height = width
    }



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/screens/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/screens'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Screen wurde erstellt')
                navigateTo(apiRoute('/d/screens/screens/editor/:id', { id: response.value?.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/screens/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Screen wurde aktualisiert')
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
