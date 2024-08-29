<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Screen Gerät Editor" color="#84cc16">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/screens/devices"/>
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
                        <IodButton type="button" label="Playlist hinzufügen" size="s" corner="pill" variant="contained" @click="playlistPicker.open(addPlaylists)"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.playlists.length">
                        <HeCard class="entity-card" v-for="playlist in form.playlists">
                            <div class="entity-card-head">
                                <IodIcon icon="drag_indicator" />
                                <b class="flex-1" >{{ playlist.name }}</b>
                                <IodButtonGroup corner="pill">
                                    <IodIconButton :is="NuxtLink" class="!w-10" icon="open_in_new" size="s" v-tooltip="'Playlist bearbeiten'" target="_blank" :to="`/screens/playlists/editor/${playlist.id}`"/>
                                    <IodIconButton type="button" class="!w-10" icon="close" size="s" color-preset="error" v-tooltip="'Entfernen'" @click="removePlaylist(playlist)"/>
                                </IodButtonGroup>
                            </div>
                            <div class="entity-card-body">
                                <div class="h-10 flex items-center gap-2 pl-3 pr-1 rounded-full bg-background-soft">
                                    <IodIcon icon="view_week" v-tooltip="'Wochentage'"/>
                                    <HeDivider vertical class="h-6 !border-slate-300"/>
                                    <IodButtonGroup corner="pill" class="flex-1">
                                        <IodButton type="button" class="weekday-button" label="Mo" size="s" :variant="playlist.on_days.includes(1) ? 'filled' : 'text'" @click="toggleWeekday(playlist, 1)"/>
                                        <IodButton type="button" class="weekday-button" label="Di" size="s" :variant="playlist.on_days.includes(2) ? 'filled' : 'text'" @click="toggleWeekday(playlist, 2)"/>
                                        <IodButton type="button" class="weekday-button" label="Mi" size="s" :variant="playlist.on_days.includes(3) ? 'filled' : 'text'" @click="toggleWeekday(playlist, 3)"/>
                                        <IodButton type="button" class="weekday-button" label="Do" size="s" :variant="playlist.on_days.includes(4) ? 'filled' : 'text'" @click="toggleWeekday(playlist, 4)"/>
                                        <IodButton type="button" class="weekday-button" label="Fr" size="s" :variant="playlist.on_days.includes(5) ? 'filled' : 'text'" @click="toggleWeekday(playlist, 5)"/>
                                        <IodButton type="button" class="weekday-button" label="Sa" size="s" :variant="playlist.on_days.includes(6) ? 'filled' : 'text'" @click="toggleWeekday(playlist, 6)"/>
                                        <IodButton type="button" class="weekday-button" label="So" size="s" :variant="playlist.on_days.includes(0) ? 'filled' : 'text'" @click="toggleWeekday(playlist, 0)"/>
                                    </IodButtonGroup>
                                </div>

                                <div class="h-10 flex items-center gap-2 pl-3 pr-1 rounded-full bg-background-soft">
                                    <IodIcon icon="desktop_windows" v-tooltip="'Auswahl des Bildschirms'"/>
                                    <HeDivider vertical class="h-6 !border-slate-300"/>
                                    <div corner="pill" class="flex-1 flex gap-1">
                                        <IodButton type="button" class="flex-1" label="Alle" size="s" corner="pill" :variant="playlist.on_screen === null ? 'filled' : 'text'" @click="playlist.on_screen = null"/>
                                        <IodButton type="button" class="flex-1" label="1" size="s" corner="pill" :variant="playlist.on_screen === '1' ? 'filled' : 'text'" @click="playlist.on_screen = '1'"/>
                                        <IodButton type="button" class="flex-1" label="2" size="s" corner="pill" :variant="playlist.on_screen === '2' ? 'filled' : 'text'" @click="playlist.on_screen = '2'"/>
                                        <IodButton type="button" class="flex-1" label="3" size="s" corner="pill" :variant="playlist.on_screen === '3' ? 'filled' : 'text'" @click="playlist.on_screen = '3'"/>
                                        <IodButton type="button" class="flex-1" label="4" size="s" corner="pill" :variant="playlist.on_screen === '4' ? 'filled' : 'text'" @click="playlist.on_screen = '4'"/>
                                    </div>
                                </div>

                                <div class="h-10 flex items-center gap-2 pl-3 pr-2 rounded-full bg-background-soft">
                                    <IodIcon icon="calendar_month" v-tooltip="'Start- und Enddatum'"/>
                                    <HeDivider vertical class="h-6 !border-slate-300"/>
                                    <span>von</span>
                                    <VDropdown>
                                        <a class="font-mono cursor-pointer font-bold">{{playlist.from_date ?? 'tt.mm.jjjj'}}</a>
                                        <template #popper><IodDatePicker v-model="playlist.from_date"/></template>
                                    </VDropdown>
                                    <span>bis</span>
                                    <VDropdown>
                                        <a class="font-mono cursor-pointer font-bold">{{playlist.to_date ?? 'tt.mm.jjjj'}}</a>
                                        <template #popper><IodDatePicker v-model="playlist.to_date"/></template>
                                    </VDropdown>
                                </div>
                                <IodInput type="date" label="Von Datum" v-model="playlist.from_date" clearable/>
                                <IodInput type="date" label="Bis Datum" v-model="playlist.to_date" clearable/>

                                <div class="h-10 flex items-center gap-2 pl-3 pr-2 rounded-full bg-background-soft">
                                    <IodIcon icon="schedule" v-tooltip="'Start- und Endzeit'"/>
                                    <HeDivider vertical class="h-6 !border-slate-300"/>
                                    <span>von</span>
                                    <VDropdown>
                                        <a class="font-mono cursor-pointer font-bold">{{playlist.from_time ?? '--:--:--'}}</a>
                                        <template #popper><IodTimePicker v-model="playlist.from_time"/></template>
                                    </VDropdown>
                                    <span>bis</span>
                                    <VDropdown>
                                        <a class="font-mono cursor-pointer font-bold">{{playlist.to_time ?? '--:--:--'}}</a>
                                        <template #popper><IodTimePicker v-model="playlist.to_time"/></template>
                                    </VDropdown>
                                </div>
                            </div>
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
                navigateTo(apiRoute('/screens/devices/editor/:id', { id: response.data?.id }))
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
        display: flex
        flex-direction: column
        gap: 1rem

    .entity-card
        display: flex
        flex-direction: column
        align-items: stretch
        overflow: hidden
        box-shadow: none !important

        .entity-card-head
            display: flex
            align-items: center
            min-height: 5rem
            padding: 1rem
            gap: 1rem
            user-select: none
            background-color: var(--color-background-soft)
            background-image: url('/images/app/banner_pattern_dark.png')
            background-size: auto 150%
            background-position: top center

            > b
                text-shadow: 0px 0px 4px var(--color-background-soft)
                font-family: var(--font-heading)
                font-weight: 600
                font-size: 1rem
                color: var(--color-text)

        .entity-card-body
            display: grid
            grid-template-columns: 1fr 1fr
            grid-template-rows: 1fr 1fr
            gap: 1rem
            padding: 1rem

            .weekday-button
                padding: 0 !important
                text-transform: none !important
                letter-spacing: 0 !important
</style>
