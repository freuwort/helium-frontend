<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Event-Einladungs Editor" color="#10b981">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" :to="'/events/' + eventId + '/invites'"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Einladungstyp" v-model="form.model.type"/>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodInput label="Email" v-model="form.model.email"/>
                    <IodInput label="Telefon" v-model="form.model.phone"/>
                    <IodInput label="Code" v-model="form.model.code">
                        <template #right>
                            <IodIconButton type="button" icon="password" v-tooltip="'Code generieren'" size="s" variant="text" @click="form.model.code = randomString(40)"/>
                        </template>
                    </IodInput>
                    <IodToggle label="Braucht Anmeldung" v-model="form.model.needs_claim"/>
                    <IodInput label="Nutzer" v-model="form.model.user_id"/>
                    <IodInput label="Formular" v-model="form.model.form_id"/>
                    <div class="flex">
                        <IodButtonGroup corner="l">
                            <IodIconButton type="button" icon="remove" background="var(--bg-zinc-600)" :variant="form.model.status === null ? 'filled' : 'contained'" @click="form.model.status = null" />
                            <IodIconButton type="button" icon="close" background="var(--bg-red-500)" :variant="form.model.status === 'rejected' ? 'filled' : 'contained'" @click="form.model.status = 'rejected'" />
                            <IodIconButton type="button" icon="question_mark" background="var(--bg-amber-500)" :variant="form.model.status === 'maybe' ? 'filled' : 'contained'" @click="form.model.status = 'maybe'" />
                            <IodIconButton type="button" icon="check" background="var(--bg-green-500)" :variant="form.model.status === 'accepted' ? 'filled' : 'contained'" @click="form.model.status = 'accepted'" />
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
    const scope = 'view_admin_eventinvites_show'

    

    // Params
    const eventId = computed(() => useRoute().params.event_id ?? null)
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            event_id: eventId.value,
            user_id: null,
            form_id: null,
            type: '',
            needs_claim: false,
            name: '',
            email: '',
            phone: '',
            code: '',
            status: null,
            created_at: '',
            updated_at: '',
        },
    })
    
    
    
    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/events/:eventId/invites/:id', { eventId: eventId.value, id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/events/:eventId/invites', { eventId: eventId.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Einladung wurde erstellt')
                navigateTo(apiRoute('/events/:eventId/invites/editor/:id', {
                    eventId: response.data?.model?.event_id,
                    id: response.data?.id
                }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/events/:eventId/invites/:id', { eventId: eventId.value, id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Einladung wurde aktualisiert')
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
