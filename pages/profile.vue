<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Ihr Profil">
        <HeCard>
            <ProfileCard
                class="rounded-t-2xl border-b"
                :title="(auth.user?.fullname as string)"
                :avatar="(auth.user?.avatar as string)"
                :banner="(auth.user?.banner as string)"
                :subtitle="(auth.user?.username as string)"
            />


            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1 border-b">
                <SettingsTitle>Allgemeine Einstellungen</SettingsTitle>
                <SettingsRow title="Sprache">
                    <IodSelect class="flex-1" label="Sprache" :modelValue="language" @update:modelValue="auth.setSettings('ui_language', $event, 'db')" :options="options_language"/>
                </SettingsRow>
                <SettingsRow title="Zeitzone">
                    <IodSelect class="flex-1" label="Zeitzone" :modelValue="timezone" @update:modelValue="auth.setSettings('ui_timezone', $event, 'db')" :options="options_timezone"/>
                </SettingsRow>
                <SettingsRow title="Theme">
                    <IodSelect class="flex-1" label="Theme" :modelValue="theme" @update:modelValue="auth.setSettings('ui_theme', $event, 'db')" :options="options_theme"/>
                </SettingsRow>
            </HeFlex>
            
            
            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1 border-b">
                <SettingsTitle>Kontosicherheit</SettingsTitle>
                <SettingsRow title="Passwort ändern">
                    <IodButton class="flex-1" corner="pill" label="Passwort ändern" @click="changePasswordPopup.open()"/>
                </SettingsRow>
            </HeFlex>

                
            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1 border-b">
                <SettingsTitle>Zwei Faktor Authentifizierung</SettingsTitle>

                <SettingsRow title="Authenticator App">
                    <template v-if="auth.user?.has_tfa_totp_method_enabled">
                        <IodButton v-if="auth.user?.default_tfa_method === 'totp'" class="flex-1" corner="pill" label="Standard Methode" disabled v-tooltip="'Dies ist Ihre Standard-Methode'"/>
                        <IodButton v-else class="flex-1" variant="contained" corner="pill" label="Als Standard festlegen" v-tooltip="'Als Standard-Methode festlegen'" @click="setDefaultTwoFactorMethod('totp')"/>
                        <IodIconButton variant="contained" corner="pill" icon="close" v-tooltip="'Diese Zwei Faktor Methode löschen'" color-preset="error" @click="destroyTwoFactorMethod('totp')"/>
                    </template>
                    <IodButton v-else class="flex-1" corner="pill" variant="contained" icon-left="screen_lock_portrait" label="App einrichten" @click="twoFactorSetup.setupTotp()"/>
                </SettingsRow>

                <SettingsRow title="Backup Codes">
                    <IodButton class="flex-1" corner="pill" variant="contained" icon-left="key" label="Backup-Codes Anzeigen" @click="twoFactorSetup.showBackup()"/>
                </SettingsRow>
            </HeFlex>


            <HeFlex padding="1.5rem 1rem" gap="1rem" align-y="flex-start" class="flex-1 border-b">
                <SettingsTitle>Benachrichtigungen</SettingsTitle>
                <SettingsRow title="Nutzerkonto freigeben" description="Erhalten Sie eine Benachrichtigung, wenn ein Nutzer auf eine Freigabe wartet." v-if="auth.can('system.enable.users')">
                    <IodToggle class="flex-1 !rounded-full" label="Email" border :modelValue="auth.getSettings('notification_email_user_verified', true, 'db')" @update:modelValue="auth.setSettings('notification_email_user_verified', $event, 'db')"/>
                    <IodToggle class="flex-1 !rounded-full" label="App" border :modelValue="auth.getSettings('notification_app_user_verified', true, 'db')" @update:modelValue="auth.setSettings('notification_app_user_verified', $event, 'db')"/>
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

        <DialogSetupTwoFactor ref="twoFactorSetup"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'
    
    const auth = useAuthStore()
    const scope = 'view_admin_profile_show'



    // START: Personal settings
    const language = computed(() => auth.user?.settings?.ui_language ?? 'de')
    const timezone = computed(() => auth.user?.settings?.ui_timezone ?? 'Europe/Berlin')
    const theme = computed(() => auth.user?.settings?.ui_theme ?? 'light')

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
        { value: 'system', text: 'System' },
    ]
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
                changePasswordPopup.value.close()
                toast.success('Passwort geändert')
            },
        })
    }
    // END: Change password



    // START: 2FA
    const twoFactorSetup = ref()

    function setDefaultTwoFactorMethod(method: string)
    {
        useForm({}).put(`/api/user/two-factor/default/${method}`, {
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



    // START: Delete account
    const deleteAccountPopup = ref()
    const deleteAccountForm = useForm({
        password: '',
    })

    function deleteAccount()
    {
        deleteAccountForm.delete('/api/user', {
            onSuccess() {
                deleteAccountPopup.value.close()
                toast.success('Ihr Konto wird nun gelöscht')
                auth.logout()
            },
        })
    }
    // END: Delete account
</script>

<style lang="sass" scoped></style>
