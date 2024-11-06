type Profile = {
    name: string
    fields: string[]
    auto_assign_roles: string[]
    groups: string[]
    auto_approve: boolean
    valid?: boolean
    profiles?: string[]
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
    
    const selectableProfiles = computed<Profile[]>(() => {
        if (!selection.value.size) {
            return customProfiles.value
        }

        if (useCommonGroups.value) {
            return customProfiles.value.filter(profile => arrayIntersect(profile.groups, commonGroups.value).length || selection.value.has(profile.name))
        }
        
        return selectedProfiles.value
    })

    const compiledProfile = computed<Profile>(() => {
        let profiles = [defaultProfile.value, ...selectedProfiles.value]

        return {
            name: '',
            valid: isValid.value,
            fields: arrayUnique(profiles.map(profile => profile.fields).flat()),
            auto_assign_roles: arrayUnique(profiles.map(profile => profile.auto_assign_roles).flat()),
            auto_approve: profiles.some(profile => profile.auto_approve),
            groups: commonGroups.value,
            profiles: selectedProfiles.value.map(profile => profile.name)
        }
    })



    const commonGroups = computed(() => {
        return arrayCommon(selectedProfiles.value.map(profile => profile.groups || []))
    })

    const useCommonGroups = computed(() => {
        return !selectedProfiles.value.every(profile => profile.groups.length <= 0)
    })

    const isValid = computed<boolean>(() => {
        if (!useCommonGroups.value) {
            return selectedProfiles.value.filter(profile => !profile.groups.length).length <= 1
        }

        return commonGroups.value.length > 0
    })



    function selectProfile(profile: Profile): void {
        if (!isSelectable(profile)) return
        selection.value.add(profile.name)
    }

    function deselectProfile(profile: Profile): void {
        selection.value.delete(profile.name)
    }
    
    function toggleProfile(profile: Profile): void {
        selection.value.has(profile.name) ? deselectProfile(profile) : selectProfile(profile)
    }

    function hasField(field: string) {
        return compiledProfile.value.fields.includes(field)
    }

    function isSelected(profile: Profile) {
        return selectedProfiles.value.includes(profile)
    }

    function isSelectable(profile: Profile) {
        return selectableProfiles.value.includes(profile) || selectedProfiles.value.includes(profile)
    }



    return {
        defaultProfile,
        compiledProfile,
        customProfiles,
        selectedProfiles,
        selectableProfiles,
        select: selectProfile,
        deselect: deselectProfile,
        toggle: toggleProfile,
        isSelected,
        isSelectable,
        hasField,
    }
}