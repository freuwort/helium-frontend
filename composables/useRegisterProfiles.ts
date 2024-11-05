type Profile = {
    name: string
    fields: string[]
    auto_assign_roles: string[]
    groups: string[]
    auto_approve: boolean
}



export function useRegisterProfiles() {
    const domain = useDomainStore()

    const templateProfile = {
        name: '',
        fields: [],
        auto_assign_roles: [],
        groups: [],
        auto_approve: false
    }

    const selection = ref(new Set<string>([]))
    const allProfiles = computed<Profile[]>(() => domain.settings?.registration_profiles || [])
    const customProfiles = computed<Profile[]>(() => allProfiles.value.filter(profile => profile.name !== 'default'))
    const selectedProfiles = computed<Profile[]>(() => customProfiles.value.filter(profile => selection.value.has(profile.name)))
    const notSelectedProfiles = computed<Profile[]>(() => customProfiles.value.filter(profile => !selection.value.has(profile.name)))
    const defaultProfile = computed<Profile>(() => allProfiles.value.find(profile => profile.name === 'default') || {...templateProfile, name: 'default'})

    function selectProfile(profile: Profile) {
        selection.value.add(profile.name)
    }

    function deselectProfile(profile: Profile) {
        selection.value.delete(profile.name)
    }
    
    function toggleProfile(profile: Profile) {
        if (selection.value.has(profile.name)) {
            deselectProfile(profile)
        } else {
            selectProfile(profile)
        }
    }

    const commonGroups = computed(() => {
        return findCommonItems(selectedProfiles.value.map(profile => profile.groups))
    })

    const useCommonGroups = computed(() => {
        return !selectedProfiles.value.every(profile => profile.groups.length <= 0)
    })

    const selectableProfiles = computed<Profile[]>(() => {
        if (!selection.value.size) {
            return customProfiles.value
        }

        if (useCommonGroups.value) {
            return notSelectedProfiles.value.filter(profile => intersect(profile.groups, commonGroups.value).length)
        }
        
        return []
    })

    const isValidSelection = computed(() => {
        if (!useCommonGroups.value) {
            return selectedProfiles.value.filter(profile => !profile.groups.length).length <= 1
        }

        return commonGroups.value.length > 0
    })

    const requiredFields = computed(() => {
        return Array.from(new Set([defaultProfile.value, ...selectedProfiles.value].map(profile => profile.fields).flat()))
    })

    function showField(field: string) {
        return requiredFields.value.includes(field)
    }

    

    return {
        defaultProfile,
        customProfiles,
        selectedProfiles,
        selectableProfiles,
        isValidSelection,
        select: selectProfile,
        deselect: deselectProfile,
        toggle: toggleProfile,
        requiredFields,
        showField,
    }
}