<template>
    <div class="flex items-center flex-wrap gap-4 min-h-10 mb-6">
        <h2 class="m-0 text-xl font-medium flex-1">Nutzer Registrierungen</h2>
        <IodButton corner="m" size="s" color-preset="error" label="Deaktivieren" @click="setStatus(false)" v-if="form.policy_allow_registration"/>
    </div>

    <ErrorAlert :errors="form.errors" class="mb-4" />

    <template v-if="form.policy_allow_registration">
        <div class="flex items-center min-h-10">
            <h3 class="flex-1 m-0 font-medium text-lg">Verpflichtende Angaben</h3>
        </div>
    
        <div class="flex flex-col gap-4 mb-6" v-if="form.default_profile">
            <div class="profile-container">
                <div class="flex flex-col gap-4 py-5 px-4">
                    <h4 class="flex-1 m-0 font-medium !text-base/4">Pflichtfelder</h4>
                    <div class="flex flex-wrap gap-2">
                        <VDropdown placement="bottom">
                            <IodIconButton class="!w-10" size="xs" corner="m" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />
    
                            <template #popper>
                                <ContextMenuBuilder :items="fieldOptions" default-icon="input" @click="addProfileArrayItem(form.default_profile, 'fields', $event)" class="min-w-64"/>
                            </template>
                        </VDropdown>
                        <IodButton size="xs" corner="m" variant="contained" color-preset="info" normal-case v-for="field in form.default_profile.fields" :label="field" @click="removeProfileArrayItem(form.default_profile, 'fields', field)" v-tooltip="'Entfernen'" />
                    </div>
                </div>
                <div class="flex flex-col gap-4 py-5 px-4 border-t border-inherit">
                    <h4 class="flex-1 m-0 font-medium !text-base/4">Auto-Rollen</h4>
                    <div class="flex flex-wrap gap-2">
                        <VDropdown placement="bottom">
                            <IodIconButton class="!w-10" size="xs" corner="m" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />
    
                            <template #popper>
                                <DialogSearchRoles @select="addProfileArrayItem(form.default_profile, 'auto_assign_roles', $event[0].name)" />
                            </template>
                        </VDropdown>
                        <IodButton size="xs" corner="m" variant="contained" color-preset="info" normal-case v-for="option in form.default_profile.auto_assign_roles" :label="option" @click="removeProfileArrayItem(form.default_profile, 'auto_assign_roles', option)" v-tooltip="'Entfernen'" />
                    </div>
                </div>
                <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                    <IodToggle type="switch" label="Nutzer nach der Registrierung automatisch freischalten" v-model="form.default_profile.auto_enable" style="--local-color-off: var(--color-text-soft-disabled); --local-color-on: var(--color-info);"/>
                </div>
            </div>
        </div>
    
        <div class="flex items-center min-h-10">
            <h3 class="flex-1 m-0 font-medium text-lg">Optionale Profile</h3>
            <IodButton type="button" label="Neues Profil" icon-right="add" corner="m" size="s" variant="contained" @click="addProfile()"/>
        </div>
    
        <div class="flex flex-col gap-4 mb-6">
            <div class="flex flex-col" v-if="form.custom_profiles.length">
                <Container orientation="vertical" lock-axis="y" behaviour="contain" drag-handle-selector=".drag-handle" @drop="onDrop">
                    <Draggable v-for="profile in form.custom_profiles" :key="profile.id">
                        <div class="profile-container" :class="{'active': edit === profile.id}">
                            <div class="flex items-center gap-4 p-4 border-inherit">
                                <IodIcon icon="drag_indicator" class="h-10 !text-xl drag-handle" />
                                <HeDivider class="h-10" vertical />
                                <div class="flex flex-1 flex-col">
                                    <h4 class="flex-1 m-0 font-medium !text-lg/6">{{ profile.name }}</h4>
                                    <small>{{ profile.description || 'Keine Beschreibung' }} | Gruppen: {{ [...profile.groups].join(', ') || 'Keine Gruppe' }}</small>
                                </div>
                                <template v-if="profile.fields.size > 0 || profile.auto_assign_roles.size > 0 || profile.auto_enable">
                                    <div class="flex items-center ">
                                        <IodIcon icon="input" class="h-10 !text-xl" v-tooltip="'erfordert Pflichtfelder'" v-show="profile.fields.size > 0" />
                                        <IodIcon icon="badge" class="h-10 !text-xl" v-tooltip="'weist automatisch Rollen zu'" v-show="profile.auto_assign_roles.size > 0"/>
                                        <IodIcon icon="verified" class="h-10 !text-xl" v-tooltip="'automatische Freigabe'" v-show="profile.auto_enable"/>
                                    </div>
                                </template>
                                <HeDivider class="h-10" vertical />
                                <IodIconButton type="button" corner="m" size="s" variant="text" v-tooltip="'Bearbeiten'" :icon="edit == profile.id ? 'expand_less' : 'expand_more'" @click="edit = edit == profile.id ? '' : profile.id"/>
                            </div>
                            
                            <template v-if="edit === profile.id">
                                <div class="flex h-16 border-t-2 border-inherit">
                                    <IodInput class="!h-full !bg-transparent !rounded-none w-72" label="Profilname" v-model="profile.name" />
                                    <HeDivider class="!h-full !border-inherit" vertical />
                                    <IodInput class="!h-full !bg-transparent !rounded-none flex-1" label="Beschreibung" v-model="profile.description" />
                                </div>
    
                                <div class="flex flex-col gap-4 py-5 px-4 border-t border-inherit">
                                    <h3 class="flex-1 m-0 font-medium !text-base/4">Pflichtfelder</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <VDropdown placement="bottom">
                                            <IodIconButton class="!w-10" size="xs" corner="m" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />
                                            
                                            <template #popper>
                                                <ContextMenuBuilder :items="fieldOptions" default-icon="input" @click="addProfileArrayItem(profile, 'fields', $event)" class="min-w-64"/>
                                            </template>
                                        </VDropdown>
                                        <IodButton size="xs" corner="m" variant="contained" color-preset="info" normal-case v-for="field in profile.fields" :label="field" @click="removeProfileArrayItem(profile, 'fields', field)" v-tooltip="'Entfernen'" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4 py-5 px-4 border-t border-inherit">
                                    <h3 class="flex-1 m-0 font-medium !text-base/4">Auto-Rollen</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <VDropdown placement="bottom">
                                            <IodIconButton class="!w-10" size="xs" corner="m" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />
    
                                            <template #popper>
                                                <DialogSearchRoles @select="addProfileArrayItem(profile, 'auto_assign_roles', $event[0].name)" />
                                            </template>
                                        </VDropdown>
                                        <IodButton size="xs" corner="m" variant="contained" color-preset="info" normal-case v-for="option in profile.auto_assign_roles" :label="option" @click="removeProfileArrayItem(profile, 'auto_assign_roles', option)" v-tooltip="'Entfernen'" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-4 py-5 px-4 border-t border-inherit">
                                    <h3 class="flex-1 m-0 font-medium !text-base/4">Gruppen</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <VDropdown placement="bottom">
                                            <IodIconButton class="!w-10" size="xs" corner="m" icon="add" color-preset="info" v-tooltip="'Hinzufügen'" />
    
                                            <template #popper>
                                                <ContextMenu class="min-w-80">
                                                    <IodInput class="!h-16 !bg-transparent !my-[-1rem]" label="Neue Gruppe" v-model="newGroup" @keydown.enter="addGroup(profile, newGroup)">
                                                        <template #right>
                                                            <IodIconButton variant="text" icon="add" @click="addGroup(profile, newGroup)" v-tooltip="'Gruppe anlegen'" />
                                                        </template>
                                                    </IodInput>
                                                    <ContextMenuDivider v-show="!!groupOptions.length"/>
                                                    <ContextMenuItem is="button" v-for="option in groupOptions" :key="option" icon="workspaces" :label="option" @click="addProfileArrayItem(profile, 'groups', option)" />
                                                </ContextMenu>
                                            </template>
                                        </VDropdown>
                                        <IodButton size="xs" corner="m" variant="contained" color-preset="info" normal-case v-for="option in profile.groups" :label="option" @click="removeProfileArrayItem(profile, 'groups', option)" v-tooltip="'Entfernen'" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 p-4 border-t border-inherit">
                                    <IodToggle type="switch" class="!px-0 !py-1 !min-h-0" label="Nutzer nach der Registrierung automatisch freischalten" v-model="profile.auto_enable" style="--local-color-off: var(--color-text-soft-disabled); --local-color-on: var(--color-info);"/>
                                </div>
                                <div class="flex gap-2 p-4 border-t border-inherit">
                                    <IodButton type="button" corner="m" size="s" color-preset="error" variant="contained" label="Profil löschen" @click="removeProfile(profile)"/>
                                </div>
                            </template>
                        </div>
                    </Draggable>
                </Container>
            </div>
    
            <IodAlert type="placeholder" class="h-20 border-2" text="Keine Profile angelegt" v-else/>
        </div>

        <div class="flex items-center flex-wrap gap-4 min-h-10 mb-6">
            <h2 class="flex-1 m-0 font-medium text-2xl"></h2>
            <IodButton corner="m" size="s" label="Speichern" :disabled="!isValid" :loading="form.processing" @click="save" />
        </div>
    </template>
    <IodAlert type="placeholder" class="h-40 border-2" v-else>
        <span>Nutzer können sich derzeit nicht selber registrieren</span><br>
        <IodButton class="mt-6" corner="m" size="s" color-preset="success" icon-left="check" label="Registrierungen erlauben" normal-case @click="setStatus(true)" />
    </IodAlert>
</template>

<script lang="ts" setup>
    // @ts-nocheck
    import { Container, Draggable } from 'vue3-smooth-dnd'
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    type Profile = {
        id?: string,
        name: string,
        description: string,
        fields: Set<string>,
        groups: Set<string>,
        auto_assign_roles: Set<string>,
        auto_enable: boolean,
    }



    const edit = ref('')
    const form = useForm({
        policy_allow_registration: false,
        default_profile: null,
        custom_profiles: [],
    })



    function newProfile(profile?: Partial<Profile>): Profile {
        let name = profile?.name || findNextAvailableName()

        return {
            id: slugify(name),
            name: name,
            description: profile?.description || '',
            fields: new Set(profile?.fields || []),
            groups: new Set(profile?.groups || []),
            auto_assign_roles: new Set(profile?.auto_assign_roles || []),
            auto_enable: profile?.auto_enable || false,
        }
    }



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
        {type: 'label', label: 'Rechtliches'},
        {type: 'item', label: 'Datenschutzerklärung', icon: 'input', value: 'gdpr'},
        {type: 'item', label: 'AGBs', icon: 'input', value: 'terms'},
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
        form.custom_profiles.push(newProfile())
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
        let profiles = domain.settings?.registration_profiles?.map((profile: Profile) => newProfile(profile)) || []

        form.policy_allow_registration = domain.settings?.policy_allow_registration ?? false
        form.default_profile = profiles.find((profile: Profile) => profile.name === 'default') || newProfile({name: 'default'})
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

    function setStatus(status: boolean) {
        form.policy_allow_registration = status
        form.transform((data) => ({ policy_allow_registration: data.policy_allow_registration }))
        .patch('/api/settings', {
            onSuccess() {
                status ? toast.success('Registrierungen aktiviert') : toast.info('Registrierungen deaktiviert')
                domain.fetchSettings()
            }
        })
    }

    load()
</script>

<style lang="sass" scoped>
    .smooth-dnd-container.vertical
        display: flex
        flex-direction: column
        gap: 1rem
        
    .profile-container
        background: var(--color-background)
        border: 2px solid var(--color-border)
        border-radius: var(--radius-l)
        backdrop-filter: blur(15px)

        &.active
            border-color: var(--color-info)
            background: #6666ff11
            position: relative
            z-index: 1
</style>
