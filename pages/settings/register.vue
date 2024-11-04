<template>
    <div class="flex items-center min-h-10">
        <h3 class="flex-1 m-0 font-medium">Registrierung</h3>
    </div>

    <ErrorAlert :errors="form.errors" class="mb-8" />

    <div class="flex flex-col gap-4 pb-8" v-if="form.default_profile">
        <div class="profile-container">
            <div class="flex flex-col gap-4 p-4">
                <h6 class="flex-1 m-0 font-medium">Felder</h6>
                <div class="flex flex-wrap gap-2">
                    <VDropdown placement="bottom-start">
                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                        <template #popper>
                            <ContextMenuBuilder :items="fieldOptions" default-icon="input" @click="addProfileArrayItem(form.default_profile, 'fields', $event)" class="min-w-64"/>
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

    <div class="flex items-center min-h-10">
        <h3 class="flex-1 m-0 font-medium">Profile</h3>
        <IodButton type="button" label="Neues Profil" icon-right="add" corner="pill" variant="contained" @click="addProfile()"/>
    </div>

    <div class="flex flex-col gap-4">
        <div class="flex flex-col" v-if="form.custom_profiles.length">
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
                                            <ContextMenuBuilder :items="fieldOptions" default-icon="input" @click="addProfileArrayItem(profile, 'fields', $event)" class="min-w-64"/>
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

        <IodAlert type="placeholder" class="h-20" text="Keine Profile angelegt" v-else/>
    </div>

    <div class="flex items-center min-h-10">
        <HeSpacer />
        <IodButton corner="pill" label="Speichern" icon-right="save" :disabled="!isValid" :loading="form.processing" @click="save"/>
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
        default_profile: null,
        custom_profiles: [],
    })

    const profileTemplate = {
        name: '',
        fields: [],
        auto_assign_roles: [],
        compatible_with: [],
        auto_approve: false,
    }



    const profileOptions = computed(() => {
        return form.custom_profiles.map((profile: Profile) => profile.name)
    })

    const fieldOptions = computed(() => ([
        {type: 'label', label: 'Authentifizierung'},
        {type: 'item', label: 'Email', icon: 'input', value: 'email'},
        {type: 'item', label: 'Telefon', icon: 'input', value: 'phone'},
        {type: 'item', label: 'Passwort', icon: 'input', value: 'password'},
        {type: 'item', label: 'Nutzername', icon: 'input', value: 'username'},
        {type: 'divider'},
        {type: 'label', label: 'Datenfelder'},
        {type: 'submenu', label: 'Namen', icon: 'person', items: [
            {type: 'label', label: 'Namen'},
            {type: 'item', label: 'Anrede', icon: 'input', value: 'salutation'},
            {type: 'item', label: 'Präfix', icon: 'input', value: 'prefix'},
            {type: 'item', label: 'Vorname', icon: 'input', value: 'firstname'},
            {type: 'item', label: 'Zweiter Vorname', icon: 'input', value: 'middlename'},
            {type: 'item', label: 'Nachname', icon: 'input', value: 'lastname'},
            {type: 'item', label: 'Suffix', icon: 'input', value: 'suffix'},
            {type: 'item', label: 'Spitzname', icon: 'input', value: 'nickname'},
            {type: 'item', label: 'Rechtlicher Name', icon: 'input', value: 'legalname'},
        ]},
        {type: 'submenu', label: 'Adressen', icon: 'location_on', items: [
            {type: 'label', label: 'Adressen'},
            {type: 'item', label: 'Hauptadresse', icon: 'input', value: 'main_address'},
            {type: 'item', label: 'Rechnungsadresse', icon: 'input', value: 'billing_address'},
            {type: 'item', label: 'Lieferadresse', icon: 'input', value: 'shipping_address'},
        ]},
        {type: 'submenu', label: 'ID Nummern', icon: 'fingerprint', items: [
            {type: 'label', label: 'ID Nummern'},
            {type: 'item', label: 'Kunden-Nr.', icon: 'input', value: 'customer_id'},
            {type: 'item', label: 'Personal-Nr.', icon: 'input', value: 'employee_id'},
            {type: 'item', label: 'Mitglieds-Nr.', icon: 'input', value: 'member_id'},
        ]},
        {type: 'submenu', label: 'Organisation', icon: 'work', items: [
            {type: 'label', label: 'Organisation'},
            {type: 'item', label: 'Organisation', icon: 'input', value: 'organisation'},
            {type: 'item', label: 'Abteilung', icon: 'input', value: 'department'},
            {type: 'item', label: 'Position', icon: 'input', value: 'job_title'},
        ]},
        {type: 'divider'},
        {type: 'label', label: 'Datenschutz'},
        {type: 'item', label: 'Datenschutzerklärung', icon: 'input', value: 'gdpr'},
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
            ...profileTemplate,
            id: slugify(name),
            name: name,
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
        let profiles = domain.settings?.registration_profiles?.map((profile: Profile) => ({
            ...profile,
            id: slugify(profile.name),
        })) || []

        form.default_profile = profiles.find((profile: Profile) => profile.name === 'default') || {...profileTemplate, name: 'default', id: 'default', fields: ['email', 'password']}
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
