<template>
    <div class="flex items-center min-h-10">
        <h3 class="flex-1 m-0 font-medium">Registrierung</h3>
    </div>

    <ErrorAlert :errors="form.errors" class="mb-8" />

    <div class="flex flex-col gap-4 pb-8" v-if="form.default_profile">
        <div class="profile-container">
            <div class="flex flex-col gap-4 p-4">
                <h6 class="flex-1 m-0 font-medium">Pflichtfelder</h6>
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
                <h6 class="flex-1 m-0 font-medium">Auto-Rollen</h6>
                <div class="flex flex-wrap gap-2">
                    <VDropdown placement="bottom-start">
                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                        <template #popper>
                            <ContextMenu class="min-w-72">
                                <ContextMenuItem is="button" v-for="option in roleOptions" :key="option" icon="key" :label="option" @click="addProfileArrayItem(form.default_profile, 'auto_assign_roles', option)" />
                            </ContextMenu>
                        </template>
                    </VDropdown>
                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="option in form.default_profile.auto_assign_roles" :label="option" @click="removeProfileArrayItem(form.default_profile, 'auto_assign_roles', option)" v-tooltip="'Entfernen'" />
                </div>
            </div>
            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                <h6 class="flex-1 m-0 font-medium">Automatiche Freigabe</h6>
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
                            <div class="flex flex-1 flex-col">
                                <h6 class="font-medium m-0">{{ profile.name }}</h6>
                                <small>Gruppen: {{ [...profile.groups].join(', ') || 'Keine Gruppe' }}</small>
                            </div>
                            <template v-if="profile.fields.size > 0 || profile.auto_assign_roles.size > 0 || profile.auto_approve">
                                <div class="flex items-center px-1 rounded-full bg-background-soft">
                                    <IodIcon icon="input" class="h-8 !text-lg" v-tooltip="'erfordert Pflichtfelder'" v-show="profile.fields.size > 0" />
                                    <IodIcon icon="badge" class="h-8 !text-lg" v-tooltip="'weist automatisch Rollen zu'" v-show="profile.auto_assign_roles.size > 0"/>
                                    <IodIcon icon="verified" class="h-8 !text-lg" v-tooltip="'automatische Freigabe'" v-show="profile.auto_approve"/>
                                </div>
                                <HeDivider vertical class="h-8" />
                            </template>
                            <IodIconButton type="button" corner="pill" size="s" variant="text" v-tooltip="'Bearbeiten'" icon="expand_more" @click="edit = profile.id"/>
                        </div>
                        <div class="flex items-center gap-4 p-4" v-else>
                            <IodIcon icon="drag_indicator" class="h-10" />
                            <IodInput class="!h-10 no-drag" placeholder="Profilname" v-model="profile.name" />
                            <HeSpacer />
                            <IodIconButton type="button" corner="pill" size="s" color-preset="error" variant="contained" v-tooltip="'Profil löschen'" icon="delete" @click="removeProfile(profile)"/>
                            <IodIconButton type="button" corner="pill" size="s" color-preset="info" variant="filled" v-tooltip="'Übernehmen'" icon="check" @click="edit = ''"/>
                        </div>

                        <template v-if="edit === profile.id">
                            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                                <h6 class="flex-1 m-0 font-medium">Pflichtfelder</h6>
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
                                <h6 class="flex-1 m-0 font-medium">Auto-Rollen</h6>
                                <div class="flex flex-wrap gap-2">
                                    <VDropdown placement="bottom-start">
                                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                                        <template #popper>
                                            <ContextMenu class="min-w-72">
                                                <ContextMenuItem is="button" v-for="option in roleOptions" :key="option" icon="key" :label="option" @click="addProfileArrayItem(profile, 'auto_assign_roles', option)" />
                                            </ContextMenu>
                                        </template>
                                    </VDropdown>
                                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="option in profile.auto_assign_roles" :label="option" @click="removeProfileArrayItem(profile, 'auto_assign_roles', option)" v-tooltip="'Entfernen'" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                                <h6 class="flex-1 m-0 font-medium">Gruppen</h6>
                                <div class="flex flex-wrap gap-2">
                                    <VDropdown placement="bottom-start">
                                        <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />

                                        <template #popper>
                                            <ContextMenu class="min-w-72">
                                                <IodInput class="!h-12 !mx-2 !rounded-full" placeholder="Neue Gruppe" v-model="newGroup" @keydown.enter="addGroup(profile, newGroup)">
                                                    <template #right>
                                                        <IodIconButton class="!w-12" size="s" corner="pill" variant="contained" icon="add" @click="addGroup(profile, newGroup)" v-tooltip="'Gruppe anlegen'" />
                                                    </template>
                                                </IodInput>
                                                <ContextMenuDivider v-show="!!groupOptions.length"/>
                                                <ContextMenuItem is="button" v-for="option in groupOptions" :key="option" icon="workspaces" :label="option" @click="addProfileArrayItem(profile, 'groups', option)" />
                                            </ContextMenu>
                                        </template>
                                    </VDropdown>
                                    <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="option in profile.groups" :label="option" @click="removeProfileArrayItem(profile, 'groups', option)" v-tooltip="'Entfernen'" />
                                </div>
                            </div>
                            <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                                <h6 class="flex-1 m-0 font-medium">Automatiche Freigabe</h6>
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
        fields: Set<string>,
        auto_assign_roles: Set<string>,
        groups: Set<string>,
        auto_approve: boolean,
    }



    const edit = ref('')
    const form = useForm({
        default_profile: null,
        custom_profiles: [],
    })



    const newGroup = ref('')
    const groupOptions = computed(() => {
        return [...new Set(form.custom_profiles.map((profile: Profile) => [...profile.groups]).flat())]
    })
    
    function addGroup(profile: Profile, group: string) {
        if (!group) return
        addProfileArrayItem(profile, 'groups', group.trim().toLowerCase())
        newGroup.value = ''
    }

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
            id: slugify(name),
            name,
            fields: new Set([]),
            auto_assign_roles: new Set([]),
            groups: new Set([]),
            auto_approve: false,
        })
    }

    function removeProfile(profile: Profile) {
        form.custom_profiles = form.custom_profiles.filter((p: Profile) => p.name !== profile.name)
    }

    function addProfileArrayItem(profile: Profile, key: string, item: string) {
        profile[key].add(item)
    }

    function removeProfileArrayItem(profile: Profile, key: string, item: string) {
        profile[key].delete(item)
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
            id: slugify(profile?.name || ''),
            name: profile?.name || '',
            fields: new Set(profile?.fields || []),
            auto_assign_roles: new Set(profile?.auto_assign_roles || []),
            groups: new Set(profile?.groups || []),
            auto_approve: profile?.auto_approve || false,
        })) || []

        form.default_profile = profiles.find((profile: Profile) => profile.name === 'default') || {
            id: 'default',
            name: 'default',
            fields: new Set(['email', 'password']),
            auto_assign_roles: new Set([]),
            groups: new Set([]),
            auto_approve: false,
        }
        form.custom_profiles = profiles.filter((profile: Profile) => profile.name !== 'default')
    }

    function save() {
        if (!isValid.value) return

        form
        .transform((data) => ({
            registration_profiles: [
                data.default_profile, ...data.custom_profiles
            ].map((profile: Profile) => ({
                ...profile,
                fields: Array.from(profile.fields),
                auto_assign_roles: Array.from(profile.auto_assign_roles),
                groups: Array.from(profile.groups),
            }))
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
