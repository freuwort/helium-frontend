<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Screen Gerät Editor" color="#84cc16">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/d/screens/devices"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodInput label="Gruppe" v-model="form.model.group"/>
                </HeFlex>



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Gerätestandort</h5>
                    <IodInput label="Straße" v-model="form.address.address_line_1"/>
                    <!-- <IodInput label="Adresszusatz" v-model="form.address.address_line_2"/> -->
                    <IodInput label="Postleitzahl" v-model="form.address.postal_code"/>
                    <IodInput label="Stadt" v-model="form.address.city"/>
                    <!-- <IodInput label="Bundesland" v-model="form.address.state"/> -->
                    <IodSelect label="Land" v-model="form.address.country_code" :options="countries.map((e: Country) => ({text: e.name, value: e.code}))"/>
                    <HeDivider />
                    <IodInput label="Notiz" v-model="form.address.notes"/>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Playlists</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Playlist hinzufügen" size="s" variant="contained" @click="playlistPicker.open(addPlaylists)"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.playlists.length">
                        <HeCard class="entity-card" v-for="playlist in form.playlists">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="playlist_play" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removePlaylist(playlist)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodInput class="flex-1" label="Name" v-model="playlist.name" readonly/>
                                <HeDivider/>
                                <IodButtonGroup>
                                    <IodButton type="button" class="!px-0" label="Mo" :variant="playlist.on_days.includes(1) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 1)"/>
                                    <IodButton type="button" class="!px-0" label="Di" :variant="playlist.on_days.includes(2) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 2)"/>
                                    <IodButton type="button" class="!px-0" label="Mi" :variant="playlist.on_days.includes(3) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 3)"/>
                                    <IodButton type="button" class="!px-0" label="Do" :variant="playlist.on_days.includes(4) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 4)"/>
                                    <IodButton type="button" class="!px-0" label="Fr" :variant="playlist.on_days.includes(5) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 5)"/>
                                    <IodButton type="button" class="!px-0" label="Sa" :variant="playlist.on_days.includes(6) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 6)"/>
                                    <IodButton type="button" class="!px-0" label="So" :variant="playlist.on_days.includes(0) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 0)"/>
                                </IodButtonGroup>
                                <HeDivider/>
                                <IodInput type="date" label="Von Datum" v-model="playlist.from_date" clearable/>
                                <IodInput type="date" label="Bis Datum" v-model="playlist.to_date" clearable/>
                                <HeDivider/>
                                <IodInput type="time" step="1" label="Von Zeit" v-model="playlist.from_time" clearable/>
                                <IodInput type="time" step="1" label="Bis Zeit" v-model="playlist.to_time" clearable/>
                                <HeDivider/>
                                <IodInput label="Bildschirm" v-model="playlist.on_screen" clearable/>
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Playlists hinzugefügt</span>
                    </IodAlert>
                </HeFlex>
            </HeFlex>
        </HeCard>

        <DialogScreensPlaylistPicker ref="playlistPicker" multiple/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'
    import type { Country } from '~/types/units'

    definePageMeta({
        middleware: 'auth',
    })
    
    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_screen_devices_show'

    

    // Params
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            name: '',
            group: '',
            notes: '',
            owner: null,
            created_at: '',
            updated_at: '',
        },
        address: {
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            postal_code: '',
            country_code: 'de',
            latitude: 0,
            longitude: 0,
            notes: '',
        },
        playlists: [],
    })



    // START: Countries
    const countries = ref([])

    onMounted(async () => {
        countries.value = (await useAxios().get('/api/domain/units')).data?.countries ?? []
    })
    // END: Countries



    // START: Playlists
    const playlistPicker = ref()
    
    function addPlaylists(items: any)
    {
        for (const item of items)
        {
            form.playlists.push({
                id: item,
                name: 'Playlist',
                from_date: null,
                from_time: null,
                to_date: null,
                to_time: null,
                on_days: [0,1,2,3,4,5,6],
                on_screen: '',
            })
        }
    }

    function removePlaylist(item: any)
    {
        form.playlists = form.playlists.filter((e: any) => e.id !== item.id)
    }

    function toggleWeekday(item: any, day: number)
    {
        if (item?.on_days.includes(day)) item.on_days = item?.on_days.filter((e: number) => e !== day)
        else item?.on_days.push(day)
    }
    // END: Playlists



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/screens/devices/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/screens/devices'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Gerät wurde erstellt')
                navigateTo(apiRoute('/d/screens/devices/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/screens/devices/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Gerät wurde aktualisiert')
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
