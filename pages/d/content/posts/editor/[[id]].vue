<template>
    <NuxtLayout limiter="medium" name="auth-default" :pageTitle="id ? 'Beitrag bearbeiten' : 'Beitrag erstellen'" color="#F59E0B">
        <HeCard is="form" @submit.prevent="save">
            <HeFlex class="rounded-t-2xl border-b sticky top-16 z-20 bg-background" horizontal padding="1rem 1.5rem">
                <IodButton type="button" corner="pill" label="Zur Übersicht" :loading="form.processing" variant="contained" @click="navigateTo('/d/content/categories')"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </HeFlex>

            <HeFlex :padding="1.5" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.draft.name" @input="form.draft.slug = slugify(form.draft.name)"/>
                    <IodInput label="Slug" v-model="form.draft.slug">
                        <template #right>
                            <IodIconButton type="button" icon="auto_awesome" v-tooltip="'Automatisch generieren'" size="s" variant="text" @click="form.draft.slug = slugify(form.draft.name)"/>
                        </template>
                    </IodInput>

                    <TextEditor v-model="form.draft.content" label="Beschreibung" />
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
                form.defaults(response.value?.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/content/posts'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Beitrag wurde erstellt')
                navigateTo(apiRoute('/d/content/posts/editor/:id', {
                    id: response.value?.data?.id
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
                form.defaults(response.value?.data).reset()
                toast.success('Beitrag wurde aktualisiert')
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
