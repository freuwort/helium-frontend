type Profile = {
    name: string
    fields: string[]
    auto_assign_roles: string[]
    compatible_with: string[]
    auto_approve: boolean
}

type ProfileRule = {
    is_valid_selection: boolean
    required_fields: string[]
    selectable_profiles: string[]
}



export function useRegisterProfiles() {
    const domain = useDomainStore()

    const templateProfile = {
        name: '',
        fields: [],
        auto_assign_roles: [],
        compatible_with: [],
        auto_approve: false
    }

    const selectedProfiles = ref<string[]>([])
    const allProfiles = computed<Profile[]>(() => domain.settings?.registration_profiles || [])
    const defaultProfile = computed<Profile>(() => allProfiles.value.find(profile => profile.name === 'default') || {...templateProfile, name: 'default'})
    const customProfiles = computed<Profile[]>(() => allProfiles.value.filter(profile => profile.name !== 'default'))

    function selectProfile(profile: Profile) {
        if (!selectedProfiles.value.includes(profile.name) && profile.name !== 'default') {
            selectedProfiles.value.push(profile.name)
        }
    }

    function deselectProfile(profile: Profile) {
        if (selectedProfiles.value.includes(profile.name)) {
            selectedProfiles.value.splice(selectedProfiles.value.indexOf(profile.name), 1)
        }
    }
    
    function toggleProfile(profile: Profile) {
        if (selectedProfiles.value.includes(profile.name)) {
            deselectProfile(profile)
        } else {
            selectProfile(profile)
        }
    }

    const requiredFields = computed(() => {
        return [...new Set([defaultProfile.value, ...customProfiles.value.filter(profile => selectedProfiles.value.includes(profile.name))].map(profile => profile.fields).flat())]
    })

    return {
        defaultProfile,
        customProfiles,
        selectedProfiles,
        select: selectProfile,
        deselect: deselectProfile,
        toggle: toggleProfile,
        requiredFields,
    }
}