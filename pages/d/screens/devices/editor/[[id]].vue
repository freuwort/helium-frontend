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

                    <div class="flex items-center gap-4 border border-solid rounded-lg p-4" v-for="playlist in form.playlists" :key="playlist.id">
                        <b class="flex-1">{{ playlist.name }}</b>
                        <IodButtonGroup>
                            <IodButton type="button" class="!px-0 !w-10" label="Mo" size="s" :variant="playlist.on_days.includes(1) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 1)"/>
                            <IodButton type="button" class="!px-0 !w-10" label="Di" size="s" :variant="playlist.on_days.includes(2) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 2)"/>
                            <IodButton type="button" class="!px-0 !w-10" label="Mi" size="s" :variant="playlist.on_days.includes(3) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 3)"/>
                            <IodButton type="button" class="!px-0 !w-10" label="Do" size="s" :variant="playlist.on_days.includes(4) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 4)"/>
                            <IodButton type="button" class="!px-0 !w-10" label="Fr" size="s" :variant="playlist.on_days.includes(5) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 5)"/>
                            <IodButton type="button" class="!px-0 !w-10" label="Sa" size="s" :variant="playlist.on_days.includes(6) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 6)"/>
                            <IodButton type="button" class="!px-0 !w-10" label="So" size="s" :variant="playlist.on_days.includes(0) ? 'filled' : 'contained'" @click="toggleWeekday(playlist, 0)"/>
                        </IodButtonGroup>
                        <IodIconButton type="button" icon="close" size="s" variant="contained" color-preset="error" @click="removePlaylist(playlist)"/>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-if="!form.playlists.length">
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

    // Playlist picker
    const playlistPicker = ref()



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
    function addPlaylists(items: any)
    {
        for (const item of items)
        {
            form.playlists.push({
                id: item,
                name: 'Test',
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
                form.defaults(response.value?.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/screens/devices'), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Gerät wurde erstellt')
                navigateTo(apiRoute('/d/screens/devices/editor/:id', { id: response.value?.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/screens/devices/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
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
