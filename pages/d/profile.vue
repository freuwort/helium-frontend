<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Ihr Profil" color="#363E40">
        <HeCard>
            <ProfileCard
                class="rounded-t-2xl border-b"
                :title="(auth.user?.fullname as string)"
                :image="(auth.user?.profile_image as string)"
                :banner="(auth.user?.profile_banner as string)"
                :subtitle="(auth.user?.username as string)"
            />


            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1 border-b">
                <SettingsRow title="Sprache">
                    <IodSelect class="flex-1" label="Sprache" v-model="form.language" :options="options_language" @update:modelValue="save()" />
                </SettingsRow>
                <SettingsRow title="Zeitzone">
                    <IodSelect class="flex-1" label="Zeitzone" v-model="form.timezone" :options="options_timezone" @update:modelValue="save()" />
                </SettingsRow>
                <SettingsRow title="Theme">
                    <IodSelect class="flex-1" label="Theme" v-model="form.theme" :options="options_theme" @update:modelValue="save()" />
                </SettingsRow>
            </HeFlex>
            
            
            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1 border-b">
                <SettingsRow title="Passwort ändern">
                    <IodButton class="flex-1" corner="pill" label="Passwort ändern" @click="changePasswordPopup.open()"/>
                </SettingsRow>
            </HeFlex>

                
            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1 border-b">
                <SettingsTitle>Zwei Faktor Authentifizierung</SettingsTitle>

                <SettingsRow title="Authenticator App (empfohlen)">
                    <template v-if="auth.user?.has_tfa_totp_method_enabled">
                        <IodButton v-if="auth.user?.default_tfa_method === 'totp'" class="flex-1" corner="pill" label="Standard Methode" disabled v-tooltip="'Dies ist Ihre Standard-Methode'"/>
                        <IodButton v-else class="flex-1" variant="contained" corner="pill" label="Als Standard festlegen" v-tooltip="'Als Standard-Methode festlegen'" @click="setDefaultTwoFactorMethod('totp')"/>
                        <IodIconButton variant="contained" corner="pill" icon="close" v-tooltip="'Diese Zwei Faktor Methode löschen'" color-preset="error" @click="destroyTwoFactorMethod('totp')"/>
                    </template>
                    <IodButton v-else class="flex-1" corner="pill" variant="contained" icon-left="screen_lock_portrait" label="App einrichten" @click="setup2faAppPopup.open()"/>
                </SettingsRow>

                <!-- <SettingsRow title="SMS Code" description="Zweiten Faktor via SMS Code einrichten">
                    <template v-if="auth.user?.has_tfa_sms_method_enabled">
                        <IodButton v-if="auth.user?.default_tfa_method === 'sms'" class="flex-1" label="Standard Methode" disabled v-tooltip="'Dies ist Ihre Standard-Methode'"/>
                        <IodButton v-else class="flex-1" variant="contained" label="Als Standard festlegen" v-tooltip="'Als Standard-Methode festlegen'" @click="setDefaultTwoFactorMethod('sms')"/>
                        <IodIconButton variant="contained" icon="close" v-tooltip="'Diese Zwei Faktor Methode löschen'" color-preset="error" @click="destroyTwoFactorMethod('sms')"/>
                    </template>
                    <IodButton v-else class="flex-1" variant="contained" icon-left="sms" label="SMS-Code einrichten" @click="setup2faSmsPopup?.open()"/>
                </SettingsRow>

                <SettingsRow title="Email Code" description="Zweiten Faktor via Email einrichten">
                    <template v-if="auth.user?.has_tfa_email_method_enabled">
                        <IodButton v-if="auth.user?.default_tfa_method === 'email'" class="flex-1" label="Standard Methode" disabled v-tooltip="'Dies ist Ihre Standard-Methode'"/>
                        <IodButton v-else class="flex-1" variant="contained" label="Als Standard festlegen" v-tooltip="'Als Standard-Methode festlegen'" @click="setDefaultTwoFactorMethod('email')"/>
                        <IodIconButton variant="contained" icon="close" v-tooltip="'Diese Zwei Faktor Methode löschen'" color-preset="error" @click="destroyTwoFactorMethod('email')"/>
                    </template>
                    <IodButton v-else class="flex-1" variant="contained" icon-left="email" label="Email-Code einrichten"/>
                </SettingsRow> -->

                <SettingsRow title="Backup Codes">
                    <IodButton class="flex-1" corner="pill" variant="contained" icon-left="key" label="Backup-Codes Anzeigen" @click="backupCodesPopup.open()"/>
                </SettingsRow>
            </HeFlex>
                
            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1">
                <SettingsRow title="Konto löschen" description="Wenn Sie Ihr Konto löschen, werden all Ihre Daten gelöscht">
                    <IodButton class="flex-1" corner="pill" label="Konto löschen" color-preset="error" @click="deleteAccountPopup.open()"/>
                </SettingsRow>
            </HeFlex>
        </HeCard>



        <IodPopup ref="changePasswordPopup" title="Passwort ändern" max-width="500px" @open="changePasswordForm.reset">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="changePassword">
                <ErrorAlert :errors="changePasswordForm.errors"/>
                <HeFlex gap="1rem">
                    <IodInput v-model="changePasswordForm.password" label="Aktuelles Passwort" type="password"/>
                    <IodInput v-model="changePasswordForm.new_password" show-score :score-function="useZxcvbn()" label="Neues Passwort" type="password"/>
                </HeFlex>
                <IodButton label="Passwort ändern" corner="pill" size="l" :loading="changePasswordForm.processing"/>
            </HeFlex>
        </IodPopup>



        <IodPopup ref="setup2faAppPopup" title="Auth-App einrichten" max-width="500px" @open="setup2faApp">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="enable2faApp">
                <HeFlex class="bg-background-soft rounded-lg">
                    <img class="h-48 aspect-square mx-auto my-2 rounded bg-background" :src="setup2faAppForm.qr" alt="QR-Code"/>
                    <HeDivider />
                    <IodInput type="text" label="Geheimnis" readonly :modelValue="setup2faAppForm.secret">
                        <template #right>
                            <IodIconButton type="button" icon="content_copy" variant="text" corner="pill" size="s" v-tooltip="'Geheimnis kopieren'"/>
                        </template>
                    </IodInput>
                </HeFlex>
                
                <HeFlex gap=".5rem" padding=".75rem 0 .5rem">
                    <p class="m-0"><code>[1]</code> Scannen Sie den <b>QR-Code</b> mit Ihrer <b>Authenticator-App</b></p>
                    <p class="m-0"><code>[2]</code> Geben Sie den <b>6-stelligen Code</b> aus Ihrer App ein.</p>
                    <p class="m-0"><code>[3]</code> Klicken Sie auf <b>"Code Bestätigen"</b></p>
                </HeFlex>
                
                <HeFlex gap="1rem">
                    <ErrorAlert :errors="setup2faAppForm.errors"/>
                    <IodOtpInput :length="6" :dividers="[3]" v-model="setup2faAppForm.code" @complete="enable2faApp"/>
                    <IodButton label="Code Bestätigen" corner="pill" size="l"/>
                </HeFlex>
            </HeFlex>
        </IodPopup>

        <IodPopup ref="setup2faSmsPopup" title="SMS-Code einrichten" max-width="500px" @open="setup2faSmsForm.reset">
            <HeFlex gap="2.5rem" padding="1.5rem">
                <HeFlex gap="1rem">
                    <IodInput type="text" label="Handynummer" :modelValue="setup2faSmsForm.secret"/>
                    <IodButton type="button" corner="pill" label="SMS-Code senden" variant="contained"/>
                </HeFlex>
                
                <HeFlex gap=".5rem" padding=".75rem 0 .5rem">
                    <p class="m-0"><code>[1]</code> Geben Sie Ihre <b>Handynummer</b> ein.</p>
                    <p class="m-0"><code>[2]</code> Geben Sie den <b>6-stelligen Code</b> aus der SMS ein.</p>
                    <p class="m-0"><code>[3]</code> Klicken Sie auf <b>"Code Bestätigen"</b></p>
                </HeFlex>

                <HeFlex is="form" gap="1rem" @submit.prevent="enable2faSms">
                    <ErrorAlert :errors="setup2faSmsForm.errors"/>
                    <IodOtpInput :length="6" :dividers="[3]" v-model="setup2faSmsForm.code" @complete="enable2faSms"/>
                    <IodButton label="Code Bestätigen" corner="pill" size="l"/>
                </HeFlex>
            </HeFlex>
        </IodPopup>

        <IodPopup ref="backupCodesPopup" title="Ihre Backup Codes" max-width="500px" @open="fetchBackupCodes">
            <HeFlex gap="2.5rem" padding="1.5rem">
                <ErrorAlert :errors="backupCodesForm.errors"/>
                <p class="m-0">
                    Mit diesen Backup-Codes können Sie sich in Ihren Account einloggen, wenn andere 2FA-Methoden nicht funktionieren.<br>
                    <b>Bitte legen Sie diese an einem sicheren Ort ab.</b>
                </p>
                <HeFlex class="bg-background-soft rounded-lg">
                    <code class="flex justify-center flex-wrap gap-4 bg-background-soft p-4 py-8 rounded-lg">
                        <span v-for="code in backupCodesForm.codes" :key="code">{{ code }}<br></span>
                    </code>
                    <HeFlex :padding="1" class="border-t">
                        <IodButton label="Neue Codes generieren" corner="pill" variant="contained" :loading="backupCodesForm.processing" @click="regenerateBackupCodes"/>
                    </HeFlex>
                </HeFlex>
            </HeFlex>
        </IodPopup>

        <IodPopup ref="tfaSuccessPopup" title="Einrichtung erfolgreich!" max-width="500px">
            <HeFlex gap="2.5rem" padding="1.5rem">
                <p class="m-0">
                    Die Einrichtung der Zwei Faktor Authentifizierung war erfolgreich!<br>
                    <b>Sie sollten nun Ihre Backup-Codes speichern und sicher aufbewahren.</b>
                </p>
                <HeFlex horizontal gap="1rem">
                    <IodButton class="flex-1" corner="pill" variant="contained" label="Schließen" @click="tfaSuccessPopup.close()"/>
                    <IodButton class="flex-1" corner="pill" variant="filled" label="Codes Anzeigen" @click="tfaSuccessPopup.close(); backupCodesPopup.open()"/>
                </HeFlex>
            </HeFlex>
        </IodPopup>



        <IodPopup ref="deleteAccountPopup" title="Konto löschen" max-width="500px" @open="deleteAccountForm.reset">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="deleteAccount">
                <HeFlex gap="1rem">
                    <ErrorAlert :errors="deleteAccountForm.errors"/>
                    <IodAlert>
                        <span>Sie sind dabei Ihr Konto zu löschen. Wenn Sie Ihr Konto löschen, werden ebenfalls all Ihre Daten gelöscht.</span>
                        <b class="mb-1">Dies kann nicht rückgängig gemacht werden!</b>
                        <span>Bestätigen Sie die Kontolöschung, indem Sie Ihr aktuelles Passwort eingeben.</span>
                    </IodAlert>
                </HeFlex>
                <HeFlex gap="1rem">
                    <IodInput v-model="deleteAccountForm.password" label="Passwort" type="password"/>
                    <IodButton corner="pill" label="Konto entgültig löschen" size="l" color-preset="error" :loading="deleteAccountForm.processing"/>
                </HeFlex>
            </HeFlex>
        </IodPopup>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    definePageMeta({
        middleware: 'auth',
    })
    
    const auth = useAuthStore()
    const scope = 'view_admin_profile_show'



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
        if (form.language === auth.user?.settings.language && form.timezone === auth.user?.settings.timezone && form.theme === auth.user?.settings.theme) return

        form.patch('/api/user/settings', {
            onSuccess() {
                toast.success('Einstellung gespeichert')
                auth.fetchSession()
            },
        })
    }
    // END: Personal settings



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



    // START: 2FA
    function setDefaultTwoFactorMethod(method: string)
    {
        useForm({}).put(`/api/user/two-factor/set-default/${method}`, {
            onSuccess() {
                auth.fetchSession()
            }
        })
    }

    function destroyTwoFactorMethod(method: string)
    {
        useForm({}).delete(`/api/user/two-factor/destroy/${method}`, {
            onSuccess() {
                auth.fetchSession()
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

        setup2faAppForm.put('/api/user/two-factor/totp/setup', {
            onSuccess(data: any) {
                setup2faAppForm.defaults(data.value).reset()
            }
        })
    }

    function enable2faApp()
    {
        if (setup2faAppForm.processing) return

        setup2faAppForm.put('/api/user/two-factor/totp/enable', {
            onSuccess() {
                auth.fetchSession()
                setup2faAppPopup.value?.close()
                tfaSuccessPopup.value?.open()
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

    function fetchBackupCodes()
    {
        backupCodesForm.get('/api/user/two-factor/backup/show', {
            onSuccess(data: any) {
                backupCodesForm.codes = data.value.codes || []
            }
        })
    }

    function regenerateBackupCodes()
    {
        backupCodesForm.post('/api/user/two-factor/backup/generate', {
            onSuccess(data: any) {
                backupCodesForm.codes = data.value.codes || []
            }
        })
    }
    // END: 2FA Backup Codes

    // START: TFA Success Popup
    const tfaSuccessPopup = ref()
    // END: TFA Success Popup



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

<style lang="sass" scoped></style>
