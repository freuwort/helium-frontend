<template>
    <form class="display-contents" @submit.prevent="save">
        <h5 class="margin-0 weight-medium">Sprache, Zeitzone und Theme</h5>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Sprache</span>
                <small>Wählen Sie die Programm Sprache</small>
            </Flex>
            <IodSelect class="w-18" label="Sprache" v-model="form.language" :options="options_language"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Zeitzone</span>
                <small>Wählen Sie Ihre Zeitzone</small>
            </Flex>
            <IodSelect class="w-18" label="Zeitzone" v-model="form.timezone" :options="options_timezone"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Theme</span>
                <small>Wählen Sie Ihr lieblings Theme</small>
            </Flex>
            <IodSelect class="w-18" label="Theme" v-model="form.theme" :options="options_theme"/>
        </Flex>

        <IodButton class="w-18 margin-left-auto " label="Speichern" :loading="form.processing"/>
    </form>

    <div class="h-1"></div>

    <h5 class="margin-0 weight-medium">Sicherheit</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Passwort</span>
            <small>Ändern Sie Ihr Passwort</small>
        </Flex>
        <IodButton class="w-18" label="Passwort ändern" @click="changePasswordPopup?.open()"/>
    </Flex>

    <div class="h-1"></div>

    <h5 class="margin-0 weight-medium">Konto</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Konto löschen</span>
            <small>Wenn Sie Ihr Konto löschen, werden all Ihre Daten gelöscht</small>
        </Flex>
        <IodButton class="w-18" label="Konto löschen" color-preset="error" @click="deleteAccountPopup?.open()"/>
    </Flex>



    <IodPopup ref="changePasswordPopup" title="Passwort ändern" max-width="500px" @open="changePasswordForm.reset">
        <Flex is="form" :gap="2" :padding="2" @submit.prevent="changePassword">
            <ErrorAlert :errors="changePasswordForm.errors"/>
            <Flex :gap="1">
                <IodInput v-model="changePasswordForm.password" label="Aktuelles Passwort" type="password"/>
                <IodInput v-model="changePasswordForm.new_password" show-score :score-function="useZxcvbn()" label="Neues Passwort" type="password"/>
            </Flex>
            <IodButton label="Passwort ändern" size="large" :loading="changePasswordForm.processing"/>
        </Flex>
    </IodPopup>

    <IodPopup ref="deleteAccountPopup" title="Konto löschen" max-width="500px" @open="deleteAccountForm.reset">
        <Flex is="form" :gap="2" :padding="2" @submit.prevent="deleteAccount">
            <Flex :gap="1">
                <ErrorAlert :errors="deleteAccountForm.errors"/>
                <IodAlert>
                    <span>Sie sind dabei Ihr Konto zu löschen. Wenn Sie Ihr Konto löschen, werden ebenfalls all Ihre Daten gelöscht.</span>
                    <b class="margin-bottom-1">Dies kann nicht rückgängig gemacht werden!</b>
                    <span>Bestätigen Sie die Kontolöschung, indem Sie Ihr aktuelles Passwort eingeben.</span>
                </IodAlert>
            </Flex>
            <IodInput v-model="deleteAccountForm.password" label="Passwort" type="password"/>
            <IodButton label="Konto entgültig löschen" size="large" color-preset="error" :loading="deleteAccountForm.processing"/>
        </Flex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const auth = useAuthStore()



    // START: Personal settings
    const form = useForm({
        language: auth.user?.settings?.language ?? 'de',
        timezone: auth.user?.settings?.timezone ?? 'Europe/Berlin',
        theme: auth.user?.settings?.theme ?? 'light',
    })

    const options_language = [
        { value: 'de', text: 'Deutsch' },
        { value: 'en', text: 'Englisch' },
    ]

    const options_timezone = [
        { value: 'America/Los_Angeles', text: 'Los Angeles' },
        { value: 'America/New_York', text: 'New York' },
        { value: 'Europe/Berlin', text: 'Berlin' },
        { value: 'Pacific/Auckland', text: 'New Zealand' },
    ]

    const options_theme = [
        { value: 'light', text: 'Hell' },
        { value: 'dark', text: 'Dunkel' },
    ]

    function save()
    {
        form.patch('/api/user/settings', {
            onSuccess() {
                toast.success('Einstellung gespeichert')
                auth.fetchUser()
            },
        })
    }
    // END: Personal settings



    // START: Change password
    const changePasswordPopup = ref()
    const changePasswordForm = useForm({
        password: '',
        new_password: ''
    })

    function changePassword()
    {
        changePasswordForm.patch('/api/user/password', {
            onSuccess() {
                changePasswordPopup.value?.close()
                toast.success('Passwort geändert')
            },
        })
    }
    // END: Change password



    // START: Delete account
    const deleteAccountPopup = ref()
    const deleteAccountForm = useForm({
        password: ''
    })

    function deleteAccount()
    {
        deleteAccountForm.delete('/api/user', {
            onSuccess() {
                deleteAccountPopup.value?.close()
                toast.success('Ihr Konto wird nun gelöscht')
                auth.logout()
            },
        })
    }
    // END: Delete account
</script>

<style lang="sass" scoped>
    .w-18
        width: 18rem !important
</style>
