<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Beitrags Editor" color="#F59E0B">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-10 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/content/posts"/>
                <HeSpacer />
                <IodButton type="button" corner="pill" label="Zur Überprüfung freigeben" :loading="form.processing" variant="contained" @click="updateReviewStatus(true)"/>
                <IodButton type="button" corner="pill" label="Freigeben" :loading="form.processing" variant="contained" @click="approveDraft()"/>
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="1.5" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <IodAlert type="info" text="Dieser Beitrag wartet auf die finale Überprüfung bevor die Änderungen angezeigt werden." />
                    <IodInput label="Space" v-model="form.model.space_id"/>
                    
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.draft.name" @input="form.draft.slug = slugify(form.draft.name)"/>
                    <IodInput label="Slug" v-model="form.draft.slug">
                        <template #right>
                            <IodIconButton type="button" icon="auto_awesome" v-tooltip="'Automatisch generieren'" size="s" variant="text" @click="form.draft.slug = slugify(form.draft.name)"/>
                        </template>
                    </IodInput>

                    <TextEditor class="!min-h-96" v-model="form.draft.content" placeholder="Inhalt..."/>
                </HeFlex>
                
                
                
                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Zugriffsrechte</h5>
                    <IodInput label="Besitzer" readonly :modelValue="form.model.owner_id"/>
                </HeFlex>
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_content_posts_show'

    

    // Params
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            owner: null,
            owner_id: null,
            space: null,
            space_id: null,
            hidden: false,
        },
        draft: {
            type: 'draft',
            name: '',
            slug: '',
            excerpt: '',
            content: '',
            review_ready: false,
            approved_at: '',
            created_at: '',
            updated_at: '',
        },
        posts: [],
        accesses: [],
    })
    
    
    
    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/content/posts/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/content/posts'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Beitrag wurde erstellt')
                navigateTo(apiRoute('/content/posts/editor/:id', {
                    id: response.data?.id
                }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/content/posts/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Beitrag wurde aktualisiert')
            },
        })
    }

    function updateReviewStatus(status: boolean)
    {
        form.draft.review_ready = status

        form
        .patch(apiRoute('/api/content/posts/:id/review', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Beitrag wurde zur Überprüfung freigeben')
            },
        })
    }

    function approveDraft()
    {
        form
        .patch(apiRoute('/api/content/posts/:id/approve', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Beitrag wurde freigegeben')
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
