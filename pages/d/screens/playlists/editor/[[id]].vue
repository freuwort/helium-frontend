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



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Screens</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Screen hinzufügen" size="s" variant="contained" @click="screenPicker.open(addScreens)"/>
                    </HeFlex>

                    <div class="entity-list" v-if="form.screens.length">
                        <Container orientation="vertical" lock-axis="y">
                            <Draggable v-for="screen in form.screens" :key="screen.id">
                                <HeCard class="entity-card">
                                    <IodIcon icon="drag_handle" />
                                    <b class="flex-1">{{screen.name}}</b>
                                    <HeFlex gap=".5rem">
                                        <!-- <HeFlex horizontal gap="1rem">
                                            <IodInput class="flex-1 !h-10" type="date" v-model="screen.from_date"/>
                                            <IodInput class="flex-1 !h-10" type="date" v-model="screen.to_date"/>
                                        </HeFlex> -->
                                        <HeFlex horizontal gap="1rem">
                                            <IodInput class="flex-1 !h-10" type="time" step="1" v-model="screen.from_time"/>
                                            <IodInput class="flex-1 !h-10" type="time" step="1" v-model="screen.to_time"/>
                                        </HeFlex>
                                    </HeFlex>
                                    <IodButtonGroup>
                                        <IodButton type="button" class="!px-0 !w-10" label="Mo" :variant="screen.on_days.includes(1) ? 'filled' : 'contained'" @click="toggleWeekday(screen, 1)"/>
                                        <IodButton type="button" class="!px-0 !w-10" label="Di" :variant="screen.on_days.includes(2) ? 'filled' : 'contained'" @click="toggleWeekday(screen, 2)"/>
                                        <IodButton type="button" class="!px-0 !w-10" label="Mi" :variant="screen.on_days.includes(3) ? 'filled' : 'contained'" @click="toggleWeekday(screen, 3)"/>
                                        <IodButton type="button" class="!px-0 !w-10" label="Do" :variant="screen.on_days.includes(4) ? 'filled' : 'contained'" @click="toggleWeekday(screen, 4)"/>
                                        <IodButton type="button" class="!px-0 !w-10" label="Fr" :variant="screen.on_days.includes(5) ? 'filled' : 'contained'" @click="toggleWeekday(screen, 5)"/>
                                        <IodButton type="button" class="!px-0 !w-10" label="Sa" :variant="screen.on_days.includes(6) ? 'filled' : 'contained'" @click="toggleWeekday(screen, 6)"/>
                                        <IodButton type="button" class="!px-0 !w-10" label="So" :variant="screen.on_days.includes(0) ? 'filled' : 'contained'" @click="toggleWeekday(screen, 0)"/>
                                    </IodButtonGroup>
                                    <IodIconButton type="button" icon="close" variant="contained" color-preset="error" @click="removeScreen(screen)"/>
                                </HeCard>
                            </Draggable>
                        </Container>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Screens hinzugefügt</span>
                    </IodAlert>
                </HeFlex>
            </HeFlex>
        </HeCard>

        <DialogScreensScreenPicker ref="screenPicker" multiple />
    </NuxtLayout>
</template>

<script lang="ts" setup>
    // @ts-nocheck
    import { Container, Draggable } from 'vue3-smooth-dnd'
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
        screens: [],
    })



    // Options
    const type_options = [
        { value: 'playlist', text: 'Playlist' },
    ]



    // START: Screens
    const screenPicker = ref()

    function addScreens(items: any)
    {
        for (const item of items)
        {
            form.screens.push({
                id: item,
                name: 'Screen',
                from_date: null,
                from_time: null,
                to_date: null,
                to_time: null,
                on_days: [0,1,2,3,4,5,6],
            })
        }
    }

    function removeScreen(item: any)
    {
        form.screens = form.screens.filter((e: any) => e.id !== item.id)
    }

    function toggleWeekday(item: any, day: number)
    {
        if (item?.on_days.includes(day)) item.on_days = item?.on_days.filter((e: number) => e !== day)
        else item?.on_days.push(day)
    }
    // END: Screens



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/screens/playlists/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/screens/playlists'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Playlist wurde erstellt')
                navigateTo(apiRoute('/d/screens/playlists/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/screens/playlists/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Playlist wurde aktualisiert')
            },
        })
    }
    // END: Server routes



    // Fetch model
    if (id.value) fetch()
</script>

<style lang="sass" scoped>
    .entity-list
        display: flex
        flex-direction: column
        gap: 1rem

    .entity-card
        display: flex
        align-items: center
        gap: 1rem
        padding: 1rem
        overflow: hidden
        box-shadow: none !important
</style>
