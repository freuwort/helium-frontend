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

    <h5 class="margin-0 weight-medium">Zwei Faktor Authentifizierung</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Authenticator App (empfohlen)</span>
            <small>Zweiten Faktor via App einrichten</small>
        </Flex>
        <Flex horizontal :gap="1" class="w-18" v-if="auth.user.has_tfa_totp_enabled">
            <IodButton class="flex-1" variant="contained" color-preset="error" label="Einrichtung löschen" @click="destroyTwoFactorMethod('totp')"/>
            <IodIconButton variant="contained" icon="star" v-tooltip="'Als Standard-Methode festlegen'"/>
        </Flex>
        <IodButton v-else class="w-18" variant="contained" label="App einrichten" @click="setup2faAppPopup?.open()"/>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">SMS Code</span>
            <small>Zweiten Faktor via SMS Code einrichten</small>
        </Flex>
        <Flex horizontal :gap="1" class="w-18" v-if="auth.user.has_tfa_sms_enabled">
            <IodButton class="flex-1" variant="contained" color-preset="error" label="Einrichtung löschen" @click="destroyTwoFactorMethod('sms')"/>
            <IodIconButton variant="contained" icon="star" v-tooltip="'Als Standard-Methode festlegen'"/>
        </Flex>
        <IodButton v-else class="w-18" variant="contained" label="SMS Code einrichten" @click="setup2faSmsPopup?.open()"/>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Backup Codes</span>
            <small>Alternative Backup Codes zum Einloggen</small>
        </Flex>
        <IodButton class="w-18" variant="contained" label="Backup Codes Anzeigen" @click="backupCodesPopup?.open()"/>
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



    <IodPopup ref="setup2faAppPopup" title="Auth-App einrichten" max-width="500px" @open="setup2faApp">
        <form class="flex vertical gap-1 padding-2" @submit.prevent="enable2faApp">
            <Flex class="background-soft radius-m">
                <img class="h-12 aspect-ratio-1-1 margin-inline-auto margin-block-0-5 radius-s background" :src="setup2faAppForm.qr" alt="QR-Code"/>
                <hr class="margin-0">
                <IodInput type="text" label="Geheimnis" readonly :modelValue="setup2faAppForm.secret">
                    <template #right>
                        <IodIconButton type="button" icon="content_copy" variant="text" size="small" v-tooltip="'Geheimnis kopieren'"/>
                    </template>
                </IodInput>
            </Flex>
            
            <Flex :gap=".5" padding="1.75rem 0 1.5rem">
                <p class="margin-0"><code>[1]</code> Scannen Sie den <b>QR-Code</b> mit Ihrer <b>Authenticator-App</b></p>
                <p class="margin-0"><code>[2]</code> Geben Sie den <b>6-stelligen Code</b> aus Ihrer App ein.</p>
                <p class="margin-0"><code>[3]</code> Klicken Sie auf <b>"Code Bestätigen"</b></p>
            </Flex>
            
            <Flex :gap="1">
                <ErrorAlert :errors="setup2faAppForm.errors"/>
                <IodOtpInput :length="6" :dividers="[3]" v-model="setup2faAppForm.code" @complete="enable2faApp"/>
                <IodButton label="Code Bestätigen" size="large"/>
            </Flex>
        </form>
    </IodPopup>

    <IodPopup ref="setup2faSmsPopup" title="SMS-Code einrichten" max-width="500px" @open="setup2faSmsForm.reset">
        <Flex :gap="1" :padding="2">
            <IodInput type="text" label="Handynummer" :modelValue="setup2faSmsForm.secret"/>
            <IodButton type="button" label="SMS-Code senden" variant="contained"/>
            
            <Flex :gap=".5" padding="1.75rem 0 1.5rem">
                <p class="margin-0"><code>[1]</code> Geben Sie Ihre <b>Handynummer</b> ein.</p>
                <p class="margin-0"><code>[2]</code> Geben Sie den <b>6-stelligen Code</b> aus der SMS ein.</p>
                <p class="margin-0"><code>[3]</code> Klicken Sie auf <b>"Code Bestätigen"</b></p>
            </Flex>

            <Flex is="form" :gap="1" @submit.prevent="enable2faSms">
                <ErrorAlert :errors="setup2faSmsForm.errors"/>
                <IodOtpInput :length="6" :dividers="[3]" v-model="setup2faSmsForm.code" @complete="enable2faSms"/>
                <IodButton label="Code Bestätigen" size="large"/>
            </Flex>
        </Flex>
    </IodPopup>

    <IodPopup ref="backupCodesPopup" title="Backup Codes" max-width="500px">
        <Flex :gap="1" :padding="2">
            <ErrorAlert :errors="backupCodesForm.errors"/>
            <p class="margin-0">
                Mit diesen Backup-Codes können Sie sich in Ihren Account einloggen, wenn andere 2FA-Methoden nicht funktionieren.<br>
                <b>Bitte speichern Sie diese an einem sicheren Ort ab.</b>
            </p>
            <Flex class="background-soft radius-m">
                <code class="background-soft padding-1 radius-m">
                    <pre class="margin-0">{{ backupCodesForm.codes.join('\n') }}</pre>
                </code>
                <Flex horizontal :padding=".5" class="border-top">
                    <IodButton label="Neue Backup-Codes generieren" size="small" variant="contained" @click="backupCodesPopup.close()"/>
                </Flex>
            </Flex>
        </Flex>
    </IodPopup>


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



    // START: 2FA
    function destroyTwoFactorMethod(method: string)
    {
        useForm({}).delete(`/two-factor/destroy/${method}`, {
            onSuccess() {
                auth.fetchUser()
                toast.success('2FA-Methode gelöscht')
            }
        })
    }
    // END: 2FA

    // START: Setup 2FA App
    const setup2faAppPopup = ref()
    const setup2faAppForm = useForm({
        qr: '',
        secret: '',
        code: '',
    })

    function setup2faApp()
    {
        if (setup2faAppForm.processing) return

        setup2faAppForm.put('/two-factor/totp/setup', {
            onSuccess(data: any) {
                setup2faAppForm.defaults(data.value).reset()
            }
        })
    }

    function enable2faApp()
    {
        if (setup2faAppForm.processing) return

        setup2faAppForm.put('/two-factor/totp/enable', {
            onSuccess() {
                auth.fetchUser()
                setup2faAppPopup.value?.close()
                toast.success('Auth-App aktiviert')
            }
        })
    }
    // END: Setup 2FA App

    // START: Setup 2FA Sms
    const setup2faSmsPopup = ref()
    const setup2faSmsForm = useForm({
        phone: '',
        code: '',
    })

    function enable2faSms()
    {
        if (setup2faSmsForm.processing) return
    }
    // END: Setup 2FA Sms

    // START: 2FA Backup Codes
    const backupCodesPopup = ref()
    const backupCodesForm = useForm({
        codes: [],
    })
    // END: 2FA Backup Codes



    // START: Change password
    const changePasswordPopup = ref()
    const changePasswordForm = useForm({
        password: '',
        new_password: '',
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
        password: '',
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
