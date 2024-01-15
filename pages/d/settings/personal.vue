<template>
    <h5 class="margin-0 weight-medium">Sprache, Zeitzone und Theme</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Sprache</span>
            <small>Wählen Sie die Programm Sprache</small>
        </Flex>
        <select class="w-18" v-model="form.language">
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
        </select>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Zeitzone</span>
            <small>Wählen Sie Ihre Zeitzone</small>
        </Flex>
        <select class="w-18" v-model="form.timezone">
            <option value="America/Los_Angeles">Los Angeles</option>
            <option value="America/New_York">New York</option>
            <option value="Europe/Berlin">Berlin</option>
            <option value="Pacific/Auckland">New Zealand</option>
        </select>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Theme</span>
            <small>Wählen Sie Ihr lieblings Theme</small>
        </Flex>
        <select class="w-18" v-model="form.theme">
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
            <option value="system">System</option>
        </select>
    </Flex>

    <div class="h-1"></div>

    <h5 class="margin-0 weight-medium">Sicherheit</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Passwort</span>
            <small>Ändern Sie Ihr Passwort</small>
        </Flex>
        <IodButton class="w-18" label="Passwort ändern"/>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Zwei-Faktor-Authentifizierung</span>
            <small>Aktivieren Sie die Zwei-Faktor-Authentifizierung, um Ihr Konto zusätzlich zu schützen</small>
        </Flex>
        <IodToggle type="switch" v-model="form.two_factor_auth_enabled" disabled/>
    </Flex>

    <div class="h-1"></div>

    <h5 class="margin-0 weight-medium">Konto</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Konto löschen</span>
            <small>Wenn Sie Ihr Konto löschen, werden alle Ihre Daten gelöscht</small>
        </Flex>
        <IodButton class="w-18" label="Konto löschen" color-preset="error"/>
    </Flex>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()

    const form = ref({
        language: auth.user?.settings?.language ?? 'de',
        timezone: auth.user?.settings?.timezone ?? 'Europe/Berlin',
        theme: auth.user?.settings?.theme ?? 'light',
        two_factor_auth_enabled: auth.user?.settings?.two_factor_auth_enabled ?? false
    })

    watch(() => form.value.language, (value) => updateSetting('language', value))
    watch(() => form.value.timezone, (value) => updateSetting('timezone', value))
    watch(() => form.value.theme, (value) => updateSetting('theme', value))

    function updateSetting(key: string, value: any)
    {
        useForm({[key]: value}).patch('/api/user/settings', {
            onSuccess: () => auth.fetchUser(),
        })
    }



    // START: Change password
    const changePasswordForm = ref({
        current_password: '',
        new_password: ''
    })
    // END: Change password
</script>

<style lang="sass" scoped></style>
