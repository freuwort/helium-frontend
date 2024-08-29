<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Event Editor" color="#10b981">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/events"/>
                <HeSpacer />
                <IodIconButton :is="NuxtLink" class="mr-4" corner="pill" icon="forward_to_inbox" variant="contained" :to="`/events/${id}/invites`" v-tooltip="'Einladungen verwalten'" />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name" @input="form.model.slug = slugify(form.model.name)"/>
                    <IodInput label="Slug" v-model="form.model.slug">
                        <template #right>
                            <IodIconButton type="button" icon="auto_awesome" v-tooltip="'Automatisch generieren'" size="s" variant="text" @click="form.model.slug = slugify(form.model.name)"/>
                        </template>
                    </IodInput>
                    <div class="flex gap-2 items-center">
                        <IodInput
                            type="datetime-local"
                            class="flex-1"
                            label="Anfangsdatum"
                            :modelValue="toLocalDate(form.model.start_at)"
                            @update:modelValue="form.model.start_at = toUtcDate($event)"
                        />
                        <IodIcon icon="remove" />
                        <IodInput
                            type="datetime-local"
                            class="flex-1"
                            label="Enddatum"
                            :modelValue="toLocalDate(form.model.end_at)"
                            @update:modelValue="form.model.end_at = toUtcDate($event)"
                        />
                    </div>
                </HeFlex>


                <TextEditor style="--top: 8.5rem" label="Beschreibung" sticky v-model="form.model.description"/>


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


                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Medien</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Medium hinzufügen" size="s" variant="contained" @click="addMedia()"/>
                    </HeFlex>
    
                    <div class="flex flex-col gap-2" v-if="form.media.length">
                        <IodInput placeholder="Pfad" v-model="media.src_path" v-for="media, i in form.media">
                            <template #left>
                                <select v-model="media.type" class="p-0 w-24">
                                    <option value="header">Header</option>
                                    <option value="Logo">Logo</option>
                                </select>
                                <HeDivider vertical class="h-8 ml-2"/>
                            </template>
                            <template #right>
                                <IodIconButton type="button" size="s" icon="attach_file" variant="text" v-tooltip="'Dateien auswählen'" @click="filePicker.open((item: MediaItem) => {media.src_path = item.src_path; media.id = item.id })"/>
                                <IodIconButton type="button" size="s" icon="delete" variant="text" v-tooltip="'Löschen'" color-preset="error" @click="removeMedia(i)"/>
                            </template>
                        </IodInput>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Medien hinzugefügt</span>
                    </IodAlert>
                </HeFlex>
            </HeFlex>
        </HeCard>

        <DialogMediaPicker ref="filePicker" type="file"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import type { Country } from '~/types/units'
    import type { MediaItem } from '~/types/media'
    import { toast } from 'vue3-toastify'

    definePageMeta({
        middleware: 'auth',
    })
    
    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_events_show'

    

    // Params
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
        invites_count: 0,
        addresses: [],
        media: [],
    })
    
    
    
    // START: Addresses
    const countries = ref([])
    
    const address_types = [
        { value: 'main', text: 'Hauptadresse' },
        { value: 'billing', text: 'Rechnungsadresse' },
        { value: 'shipping', text: 'Lieferadresse' },
        { value: 'other', text: 'Anders' },
    ]

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



    // START: Media
    const filePicker = ref()

    function addMedia() {
        form.media.push({
            id: null,
            type: 'header',
            src_path: '',
        })
    }

    function removeMedia(index: number) {
        form.media.splice(index, 1)
    }
    // END: Media



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/events/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form
        .transform(data => ({
            ...data,
            media: data.media.map((e: any) => ({
                media_id: e.id,
                type: e.type,
            }))
        }))
        .post(apiRoute('/api/events'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Event wurde erstellt')
                navigateTo(apiRoute('/events/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .transform(data => ({
            ...data,
            media: data.media.map((e: any) => ({
                media_id: e.id,
                type: e.type,
            }))
        }))
        .patch(apiRoute('/api/events/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
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
