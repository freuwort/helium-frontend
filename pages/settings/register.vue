<template>
    <ErrorAlert :errors="form.errors" class="mb-8" />

    <div class="flex flex-col gap-4 pb-8">
        <div class="flex items-center">
            <h3 class="flex-1 m-0 font-medium">Registrierung</h3>
        </div>
    
        <div class="profile-container">
            <div class="flex flex-col gap-4 p-4">
                <h6 class="flex-1 m-0 font-medium">Felder</h6>
                <div class="flex flex-wrap gap-2">
                    <VDropdown placement="bottom-start">
                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                        <template #popper>
                            <ContextMenu class="min-w-72">
                                <ContextMenuItem v-for="option in fieldOptions" :key="option" icon="input" :label="option" @click="addProfileArrayItem(form.default_profile, 'fields', option)" />
                            </ContextMenu>
                        </template>
                    </VDropdown>
                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="field in form.default_profile.fields" :label="field" @click="removeProfileArrayItem(form.default_profile, 'fields', field)" v-tooltip="'Entfernen'" />
                </div>
            </div>
            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                <h6 class="flex-1 m-0 font-medium">Rollen</h6>
                <div class="flex flex-wrap gap-2">
                    <VDropdown placement="bottom-start">
                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                        <template #popper>
                            <ContextMenu class="min-w-72">
                                <ContextMenuItem v-for="option in roleOptions" :key="option" icon="key" :label="option" @click="addProfileArrayItem(form.default_profile, 'auto_assign_roles', option)" />
                            </ContextMenu>
                        </template>
                    </VDropdown>
                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="option in form.default_profile.auto_assign_roles" :label="option" @click="removeProfileArrayItem(form.default_profile, 'auto_assign_roles', option)" v-tooltip="'Entfernen'" />
                </div>
            </div>
            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                <h6 class="flex-1 m-0 font-medium">Automatiche Freischaltung</h6>
                <IodToggle type="switch" label="Nutzer nach der Registrierung automatisch freischalten" v-model="form.default_profile.auto_approve" style="--local-color-off: var(--color-text-soft-disabled); --local-color-on: var(--color-info);"/>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-4 pb-8">
        <div class="flex items-center">
            <h3 class="flex-1 m-0 font-medium">Profile</h3>
            <IodButton type="button" label="Neues Profil" icon-right="add" corner="pill" variant="contained" @click="addProfile()"/>
        </div>
    
        <div class="flex flex-col">
            <Container orientation="vertical" lock-axis="y" behaviour="contain" non-drag-area-selector=".no-drag" @drop="onDrop">
                <Draggable v-for="profile in form.custom_profiles" :key="profile.id">
                    <div class="profile-container" :class="{'active': edit === profile.id}">
                        <div class="flex items-center gap-4 p-4" v-if="edit !== profile.id">
                            <IodIcon icon="drag_indicator" class="h-10" />
                            <h6 class="flex-1 m-0 font-medium">{{ profile.name }}</h6>
                            <IodIconButton type="button" corner="pill" variant="contained" v-tooltip="'Bearbeiten'" icon="edit" @click="edit = profile.id"/>
                        </div>
                        <div class="flex items-center gap-4 p-4" v-else>
                            <IodIcon icon="drag_indicator" class="h-10" />
                            <IodInput class="!h-10 no-drag" placeholder="Profilname" v-model="profile.name" />
                            <HeSpacer />
                            <IodIconButton type="button" corner="pill" variant="contained" v-tooltip="'Profil löschen'" icon="delete" @click="removeProfile(profile)"/>
                            <IodIconButton type="button" corner="pill" v-tooltip="'Übernehmen'" icon="check" color-preset="info" @click="edit = ''"/>
                        </div>

                        <template v-if="edit === profile.id">
                            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                                <h6 class="flex-1 m-0 font-medium">Felder</h6>
                                <div class="flex flex-wrap gap-2">
                                    <VDropdown placement="bottom-start">
                                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                                        <template #popper>
                                            <ContextMenu class="min-w-72">
                                                <ContextMenuItem v-for="option in fieldOptions" :key="option" icon="input" :label="option" @click="addProfileArrayItem(profile, 'fields', option)" />
                                            </ContextMenu>
                                        </template>
                                    </VDropdown>
                                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="field in profile.fields" :label="field" @click="removeProfileArrayItem(profile, 'fields', field)" v-tooltip="'Entfernen'" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                                <h6 class="flex-1 m-0 font-medium">Rollen</h6>
                                <div class="flex flex-wrap gap-2">
                                    <VDropdown placement="bottom-start">
                                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                                        <template #popper>
                                            <ContextMenu class="min-w-72">
                                                <ContextMenuItem v-for="option in roleOptions" :key="option" icon="key" :label="option" @click="addProfileArrayItem(profile, 'auto_assign_roles', option)" />
                                            </ContextMenu>
                                        </template>
                                    </VDropdown>
                                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="option in profile.auto_assign_roles" :label="option" @click="removeProfileArrayItem(profile, 'auto_assign_roles', option)" v-tooltip="'Entfernen'" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                                <h6 class="flex-1 m-0 font-medium">Erlaubte Profilkombinationen</h6>
                                <div class="flex flex-wrap gap-2">
                                    <VDropdown placement="bottom-start">
                                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                                        <template #popper>
                                            <ContextMenu class="min-w-72">
                                                <ContextMenuItem v-for="option in profileOptions" :key="option" icon="patient_list" :label="option" @click="addProfileArrayItem(profile, 'compatible_with', option)" />
                                            </ContextMenu>
                                        </template>
                                    </VDropdown>
                                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="option in profile.compatible_with" :label="option" @click="removeProfileArrayItem(profile, 'compatible_with', option)" v-tooltip="'Entfernen'" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                                <h6 class="flex-1 m-0 font-medium">Automatiche Freischaltung</h6>
                                <IodToggle type="switch" label="Nutzer nach der Registrierung automatisch freischalten" v-model="profile.auto_approve" style="--local-color-off: var(--color-text-soft-disabled); --local-color-on: var(--color-info);"/>
                            </div>
                        </template>
                    </div>
                </Draggable>
            </Container>
        </div>
    </div>

    <div class="flex flex-col gap-4">
        <div class="flex items-center">
            <h2 class="flex-1 m-0 font-medium"></h2>
            <IodButton corner="pill" label="Speichern" :disabled="!isValid" :loading="form.processing" @click="save"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    // @ts-nocheck
    import { Container, Draggable } from 'vue3-smooth-dnd'
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    type Profile = {
        id?: string,
        name: string,
        fields: string[],
        auto_assign_roles: string[],
        compatible_with: string[]
        auto_approve: boolean,
    }



    const edit = ref('')
    const form = useForm({
        default_profile: {
            name: 'default',
            fields: [
                'email',
                'password',
            ],
            auto_assign_roles: [],
            compatible_with: [],
            auto_approve: false,
        },
        custom_profiles: [
            {
                id: '1',
                name: 'Mitarbeiter',
                fields: [
                    'user_name.first_name',
                    'user_name.last_name',
                ],
                auto_assign_roles: [],
                compatible_with: [],
                auto_approve: false,
            },
            {
                id: '2',
                name: 'Kunde',
                fields: [
                    'user_company.company',
                ],
                auto_assign_roles: [],
                compatible_with: [],
                auto_approve: false,
            },
        ],
    })



    const profileOptions = computed(() => {
        return form.custom_profiles.map((profile: Profile) => profile.name)
    })

    const fieldOptions = computed(() => ([
            'email',
            'password',
            'username',
            'user_name.first_name',
            'user_name.middle_name',
            'user_name.last_name',
            'user_company.company',
            'user_company.department',
            'user_company.title',
    ]))

    const roleOptions = computed(() => ([
        'Admin',
        'Personal',
        'Kunde',
    ]))



    function onDrop(dropResult: any) {
        form.custom_profiles = applyDrag(form.custom_profiles, dropResult)
    }

    function findNextAvailableName() {
        let name = 1
        while (form.custom_profiles.find((profile: Profile) => profile.name === `Profile ${name}`)) name++
        return `Profile ${name}`
    }

    function addProfile() {
        let name = findNextAvailableName()
        
        form.custom_profiles.push({
            id: slugify(name),
            name,
            fields: [],
            auto_assign_roles: [],
            compatible_with: [],
            auto_approve: false,
        })
    }

    function removeProfile(profile: Profile) {
        form.custom_profiles = form.custom_profiles.filter((p: Profile) => p.name !== profile.name)
    }

    function addProfileArrayItem(profile: Profile, key: string, item: string) {
        if (profile[key].find((n: string) => n === item)) return
        profile[key].push(item)
    }

    function removeProfileArrayItem(profile: Profile, key: string, item: string) {
        profile[key] = profile[key].filter((n: string) => n !== item)
    }



    const isValid = computed(() => {
        // Profile names are unique
        if (form.custom_profiles.length > new Set(form.custom_profiles.map((profile: Profile) => profile.name)).size) return false

        // Custom profile does not contain default profile
        if (form.custom_profiles.find((profile: Profile) => profile.name === form.default_profile.name)) return false

        // All required fields are filled
        for (const profile of form.custom_profiles) {
            if (!profile.name) return false
        }

        return true
    })



    function load() {
        let profiles = domain.settings.registration_profiles.map((profile: Profile) => ({
            ...profile,
            id: slugify(profile.name),
        }))

        form.default_profile = profiles.find((profile: Profile) => profile.name === 'default')
        form.custom_profiles = profiles.filter((profile: Profile) => profile.name !== 'default')
    }

    function save() {
        if (!isValid.value) return

        form
        .transform((data) => ({
            registration_profiles: [ data.default_profile, ...data.custom_profiles ]
        }))
        .patch('/api/settings', {
            onSuccess() {
                toast.success('Einstellungen gespeichert')
                domain.fetchSettings()
            }
        })
    }

    load()
</script>

<style lang="sass" scoped>
    .profile-container
        background: var(--color-background)
        margin-bottom: 1rem
        border: 2px solid var(--color-border)
        border-radius: var(--radius-xl)
        backdrop-filter: blur(15px)

        &.active
            border-color: var(--color-info)
            background: #6666ff11
            position: relative
            z-index: 1
</style>
