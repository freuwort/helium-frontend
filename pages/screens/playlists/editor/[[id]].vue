<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Screen Playlist Editor" color="#84cc16">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/screens/playlists"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name">
                        <template #right>
                            <IodButtonGroup corner="pill">
                                <IodIconButton type="button" class="!w-10" icon="playlist_play" size="s" :variant="form.model.type === 'playlist' ? 'filled' : 'contained'" @click="form.model.type = 'playlist'" v-tooltip="'Standard Playlist'"/>
                                <IodIconButton type="button" class="!w-10" icon="touch_app" size="s" :variant="form.model.type === 'touch' ? 'filled' : 'contained'" @click="form.model.type = 'touch'" v-tooltip="'Touch-Playlist'"/>
                            </IodButtonGroup>
                        </template>
                    </IodInput>
                </HeFlex>



                <HeFlex>
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Screens</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Screen hinzufügen" size="s" corner="pill" variant="contained" @click="screenPicker.open(addScreens)"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.screens.length">
                        <Container orientation="vertical" lock-axis="y" behaviour="contain" @drop="onDrop">
                            <Draggable v-for="screen in form.screens" :key="screen.id">

                                <HeCard class="entity-card">
                                    <div class="entity-card-head" @click.self="screen.expanded = !screen.expanded">
                                        <IodIcon icon="drag_indicator" />
                                        <b class="mr-auto" >{{ screen.name }}</b>
                                        <IodButtonGroup corner="pill">
                                            <IodIconButton :is="NuxtLink" class="!w-10" icon="open_in_new" size="s" v-tooltip="'Screen bearbeiten'" target="_blank" :to="`/screens/screens/editor/${screen.id}`"/>
                                            <IodIconButton type="button" class="!w-10" icon="close" size="s" color-preset="error" v-tooltip="'Entfernen'" @click="removeScreen(screen)"/>
                                        </IodButtonGroup>
                                        <IodIconButton type="button" :icon="screen.expanded ? 'expand_less' : 'expand_more'" corner="pill" size="s" v-tooltip="screen.expanded ? 'Einklappen' : 'Ausklappen'" @click="screen.expanded = !screen.expanded"/>
                                    </div>
                                    <div class="entity-card-body" v-if="screen.expanded">
                                        <div class="h-10 flex items-center gap-2 pl-3 pr-1 rounded-full bg-background-soft">
                                            <IodIcon icon="view_week" v-tooltip="'Wochentage'"/>
                                            <HeDivider vertical class="h-6 !border-slate-300"/>
                                            <IodButtonGroup corner="pill" class="flex-1">
                                                <IodButton type="button" class="weekday-button" label="Mo" size="s" :variant="screen.on_days.includes(1) ? 'filled' : 'text'" @click="toggleWeekday(screen, 1)"/>
                                                <IodButton type="button" class="weekday-button" label="Di" size="s" :variant="screen.on_days.includes(2) ? 'filled' : 'text'" @click="toggleWeekday(screen, 2)"/>
                                                <IodButton type="button" class="weekday-button" label="Mi" size="s" :variant="screen.on_days.includes(3) ? 'filled' : 'text'" @click="toggleWeekday(screen, 3)"/>
                                                <IodButton type="button" class="weekday-button" label="Do" size="s" :variant="screen.on_days.includes(4) ? 'filled' : 'text'" @click="toggleWeekday(screen, 4)"/>
                                                <IodButton type="button" class="weekday-button" label="Fr" size="s" :variant="screen.on_days.includes(5) ? 'filled' : 'text'" @click="toggleWeekday(screen, 5)"/>
                                                <IodButton type="button" class="weekday-button" label="Sa" size="s" :variant="screen.on_days.includes(6) ? 'filled' : 'text'" @click="toggleWeekday(screen, 6)"/>
                                                <IodButton type="button" class="weekday-button" label="So" size="s" :variant="screen.on_days.includes(0) ? 'filled' : 'text'" @click="toggleWeekday(screen, 0)"/>
                                            </IodButtonGroup>
                                        </div>
        
                                        <div class="h-10 flex items-center gap-2 pl-3 pr-2 rounded-full bg-background-soft">
                                            <IodIcon icon="calendar_month" v-tooltip="'Start- und Enddatum'"/>
                                            <HeDivider vertical class="h-6 !border-slate-300"/>
                                            <span>von</span>
                                            <VDropdown placement="left">
                                                <a class="font-mono cursor-pointer font-bold">{{screen.from_date ?? 'tt.mm.jjjj'}}</a>
                                                <template #popper><IodDatePicker v-model="screen.from_date"/></template>
                                            </VDropdown>
                                            <span>bis</span>
                                            <VDropdown placement="right">
                                                <a class="font-mono cursor-pointer font-bold">{{screen.to_date ?? 'tt.mm.jjjj'}}</a>
                                                <template #popper><IodDatePicker v-model="screen.to_date"/></template>
                                            </VDropdown>
                                        </div>
        
                                        <div class="h-10 flex items-center gap-2 pl-3 pr-2 rounded-full bg-background-soft">
                                            <IodIcon icon="schedule" v-tooltip="'Start- und Endzeit'"/>
                                            <HeDivider vertical class="h-6 !border-slate-300"/>
                                            <span>von</span>
                                            <VDropdown placement="left">
                                                <a class="font-mono cursor-pointer font-bold">{{screen.from_time ?? '--:--:--'}}</a>
                                                <template #popper><IodTimePicker v-model="screen.from_time"/></template>
                                            </VDropdown>
                                            <span>bis</span>
                                            <VDropdown placement="right">
                                                <a class="font-mono cursor-pointer font-bold">{{screen.to_time ?? '--:--:--'}}</a>
                                                <template #popper><IodTimePicker v-model="screen.to_time"/></template>
                                            </VDropdown>
                                        </div>
                                    </div>
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

    type Screen = {
        id: number
        name?: string
        from_date: string|null
        from_time: string|null
        to_date: string|null
        to_time: string|null
        on_days: number[]
    }

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



    // START: Screens
    const screenPicker = ref()

    function addScreens(items: Screen[])
    {
        form.screens.push(...items.map(item => ({
            id: item,
            name: 'Screen',
            from_date: null,
            from_time: null,
            to_date: null,
            to_time: null,
            on_days: [0,1,2,3,4,5,6],
        })))

        updateScreenOrder()
    }

    function removeScreen(item: Screen)
    {
        form.screens = form.screens.filter(screen => screen.id !== item.id)
    }

    function toggleWeekday(item: Screen, day: number)
    {
        if (item.on_days.includes(day)) item.on_days = item.on_days.filter(onDay => onDay !== day)
        else item.on_days.push(day)
    }

    function updateScreenOrder()
    {
        form.model.screen_order = form.screens.map(screen => screen.id).filter(id => id)
    }

    function onDrop(dropResult: any) {
        form.screens = applyDrag(form.screens, dropResult)
        updateScreenOrder()
    }
    // END: Screens



    // START: Server routes
    function format(data: any)
    {
        const screenOrder = data.model?.screen_order ?? []
        const screens = data.screens ?? []

        data.screens = screenOrder
        .map(id => screens.find(screen => screen.id === id))
        .filter(screen => screen)
        .concat(screens.filter(screen => !screenOrder.includes(screen.id)))

        return data
    }

    function fetch()
    {
        form.get(apiRoute('/api/screens/playlists/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(format(response.data)).reset()
            },
        })
    }

    function store()
    {
        updateScreenOrder()

        form
        .post(apiRoute('/api/screens/playlists'), {
            onSuccess(response: any)
            {
                form.defaults(format(response.data)).reset()
                toast.success('Playlist wurde erstellt')
                navigateTo(apiRoute('/screens/playlists/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        updateScreenOrder()

        form
        .patch(apiRoute('/api/screens/playlists/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(format(response.data)).reset()
                toast.success('Playlist wurde aktualisiert')
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

    .entity-card
        display: flex
        flex-direction: column
        align-items: stretch
        overflow: hidden
        box-shadow: none !important
        margin-top: 1.5rem

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
