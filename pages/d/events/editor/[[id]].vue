<template>
    <NuxtLayout limiter="medium" name="auth-default" :pageTitle="id ? 'Event bearbeiten' : 'Event erstellen'" color="#10b981">
        <HeCard is="form" @submit.prevent="save">
            <HeFlex class="rounded-t-2xl border-b sticky top-16 z-20 bg-background" horizontal padding="1rem 2rem">
                <IodButton type="button" label="Zur Übersicht" :loading="form.processing" variant="contained" @click="navigateTo('/d/events')"/>
                <HeSpacer />
                <IodButton type="submit" label="Speichern" :loading="form.processing" variant="filled" />
            </HeFlex>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodInput label="Slug" v-model="form.model.slug"/>
                    <IodInput label="Description" v-model="form.model.description"/>
                    <div class="flex gap-2 items-center">
                        <IodInput class="flex-1" type="datetime-local" label="Anfangsdatum" v-model="form.model.start_at"/>
                        <IodIcon icon="remove" />
                        <IodInput class="flex-1" type="datetime-local" label="Enddatum" v-model="form.model.end_at"/>
                    </div>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Adressen</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Adresse" size="s" variant="contained" @click="addAddress()"/>
                    </HeFlex>
    
                    <div class="entity-grid" v-if="form.addresses.length">
                        <HeCard class="entity-card" v-for="address, i in form.addresses">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="location_on" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeAddress(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="address.type" label="Adress-Typ" :options="address_types"/>
                                <IodInput v-model="address.address_line_1" label="Straße" />
                                <IodInput v-model="address.postal_code" label="Postleitzahl" />
                                <IodInput v-model="address.city" label="Stadt" />
                                <IodSelect v-model="address.country_code" label="Land" :options="countries.map((e: Country) => ({text: e.name, value: e.code}))"/>
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Adressen angelegt</span>
                    </IodAlert>
                </HeFlex>
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { debounce, throttle } from 'lodash'
    import { toast } from 'vue3-toastify'
    import type { Country } from '~/types/units'

    const dayjs = useDayjs()

    definePageMeta({
        middleware: 'auth',
    })

    

    // Item id
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            name: '',
            slug: '',
            description: '',
            start_at: '',
            end_at: '',
            created_at: '',
            updated_at: '',
        },
        addresses: [],
    })

    const countries = ref([])

    const address_types = [
        { value: 'main', text: 'Hauptadresse' },
        { value: 'billing', text: 'Rechnungsadresse' },
        { value: 'shipping', text: 'Lieferadresse' },
        { value: 'other', text: 'Anders' },
    ]
    
    
    
    // START: Addresses
    function addAddress() {
        form.addresses.push({
            id: null,
            type: 'main',
            address_line_1: '',
            address_line_2: '',
            postal_code: '',
            city: '',
            state: '',
            country_code: '',
            notes: '',
        })
    }

    function removeAddress(index: number) {
        form.addresses.splice(index, 1)
    }
    // END: Addresses



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/events/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                let data = response.value?.data
                data.model.start_at = data.model.start_at ? dayjs(data.model.start_at).format('YYYY-MM-DDTHH:mm') : null
                data.model.end_at = data.model.end_at ? dayjs(data.model.end_at).format('YYYY-MM-DDTHH:mm') : null
                form.defaults(data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/events'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Event wurde erstellt')
                navigateTo(apiRoute('/d/events/editor/:id', { id: response.value?.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/events/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Event wurde aktualisiert')
            },
        })
    }
    // END: Server routes



    // Fetch model
    if (id.value) fetch()

    onMounted(async () => {    
        // Fetch additional data
        countries.value = (await useAxios().get('/api/domain/units')).data.countries
    })
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
