<template>
    <h4 class="m-0 font-medium">Registrierung</h4>
    <p>
        Stellen Sie ein, was Nutzer bei der Registrierung angeben können und sollen
    </p>
    <form @submit.prevent="save">
        <h5 class="m-0 font-medium">Standard Einstellungen</h5>
        <IodToggle type="switch" v-model="defaultProfile.auto_approve" label="Nutzer automatisch freischalten"/>

        <HeFlex horizontal>
            <h5 class="m-0 font-medium">Profile</h5>
            <HeSpacer />
            <IodButton type="button" label="Neues Profil" size="s" corner="pill" variant="contained" @click="addProfile()"/>
        </HeFlex>

        <div class="flex flex-col gap-6 py-4">
            <div class="profile-container border-2 rounded-xl" v-for="(profile, i) in additionalProfiles" :key="i" :class="{'active': edit === profile.name}">
                <div class="flex items-center gap-4 p-4">
                    <IodIcon icon="drag_indicator" class="h-10" />
                    <IodInput class="!h-10" placeholder="Profilname" v-model="profile.name"/>
                    <HeSpacer />
                    <IodButton size="s" corner="pill" variant="contained" label="Mehr" icon-right="expand_more" @click="edit = profile.name === edit ? '' : profile.name"/>
                </div>
                <template v-if="edit === profile.name">
                    <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                        <div class="flex items-center">
                            <h6 class="flex-1 m-0 font-medium">Automatiche Freischaltung</h6>
                            <IodToggle type="switch" v-model="profile.auto_approve"/>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                        <h6 class="flex-1 m-0 font-medium">Felder</h6>
                        <div class="flex flex-wrap gap-2">
                            <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info"/>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                        <h6 class="flex-1 m-0 font-medium">Profil Kombinationen</h6>
                        <div class="flex flex-wrap gap-2">
                            <IodIconButton class="!w-12" size="s" corner="pill" icon="add" color-preset="info"/>
                            <IodButton size="s" corner="pill" variant="contained" color-preset="info" v-for="name in profile.compatible_with" :label="name"/>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 p-4 border-t border-inherit">
                        <div class="flex items-center">
                            <h6 class="flex-1 m-0 font-medium">Profil löschen</h6>
                            <IodButton type="button" size="s" corner="pill" variant="contained" label="Entfernen" color-preset="error" @click="removeProfile(profile)"/>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        
        <SettingsRow>
            <IodButton class="flex-1" corner="pill" label="Speichern" :disabled="!isValid" :loading="form.processing"/>
        </SettingsRow>
        
        <!-- <pre v-html="JSON.stringify(form.registration_profiles, null, 2)"></pre> -->
    </form>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    type Field = {
        name: string,
        required: boolean
    }

    type Profile = {
        name: string,
        fields: Field[],
        auto_approve: boolean,
        auto_assign_roles: string[],
        compatible_with: string[]
    }



    const edit = ref('')
    const form = useForm({
        registration_profiles: [
            {
                name: 'default',
                fields: [
                    { name: 'email', required: true },
                    { name: 'password', required: true },
                ],
                auto_approve: false,
                auto_assign_roles: [],
                compatible_with: [],
            },
            {
                name: 'Mitarbeiter',
                fields: [
                    { name: 'user_name.first_name', required: true },
                    { name: 'user_name.last_name', required: true },
                ],
                auto_approve: false,
                auto_assign_roles: ['Personal'],
                compatible_with: ['Mitarbeiter'],
            },
            {
                name: 'Kunde',
                fields: [
                    { name: 'user_company.company', required: true },
                ],
                auto_approve: false,
                auto_assign_roles: ['Kunde'],
                compatible_with: ['employee'],
            },
        ] as Profile[],
    })

    const defaultProfile = computed(() => {
        return form.registration_profiles.find((profile: Profile) => profile.name === 'default')
    })

    const additionalProfiles = computed(() => {
        return form.registration_profiles.filter((profile: Profile) => profile.name !== 'default')
    })

    const profileNames = computed(() => {
        return additionalProfiles.value.map((profile: Profile) => profile.name)
    })

    function findNextAvailableName() {
        let name = 1
        while (form.registration_profiles.find((profile: Profile) => profile.name === `Profile ${name}`)) name++
        return `Profile ${name}`
    }

    function addProfile() {
        form.registration_profiles.push({
            name: findNextAvailableName(),
            fields: [],
            auto_approve: false,
            auto_assign_roles: [],
            compatible_with: [],
        })
    }

    function removeProfile(profile: Profile) {
        form.registration_profiles = form.registration_profiles.filter((p: Profile) => p.name !== profile.name)
    }



    const isValid = computed(() => {
        // Default profile must exist
        if (!form.registration_profiles.find((profile: Profile) => profile.name === 'default')) return false

        // Profile names are unique
        if (form.registration_profiles.length > new Set(form.registration_profiles.map((profile: Profile) => profile.name)).size) return false

        // All required fields are filled
        for (const profile of form.registration_profiles) {
            if (!profile.name) return false
            if (!profile.label) return false
        }

        return true
    })



    function save() {
        if (!isValid.value) return

        form.patch('/api/settings', {
            onSuccess() {
                toast.success('Einstellungen gespeichert')
                domain.fetchSettings()
            }
        })
    }
</script>

<style lang="sass" scoped>
    .profile-container
        &.active
            border-color: var(--color-info)
            box-shadow: var(--shadow-l)
            background: var(--bg-blue-50)
            position: relative
            z-index: 1
</style>
