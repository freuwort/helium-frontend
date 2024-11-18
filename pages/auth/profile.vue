<template>
    <NuxtLayout name="guest-default" :scope pageTitle="Ihr Profil">
        <!-- <ProfileCard
            class="rounded-xl bg-background-soft"
            :title="(auth.user?.fullname as string)"
            :avatar="(auth.user?.avatar as string)"
            :banner="(auth.user?.banner as string)"
            :subtitle="(auth.user?.username as string)"
        /> -->
        <div class="flex flex-col items-start min-h-10">
            <IodButton size="xs" variant="text" corner="pill" icon-left="west" label="Zurück" normal-case :is="NuxtLink" :to="route.query.return ?? auth.routes.authHome" />
            <h1 class="font-medium m-0">Ihr Profil</h1>
        </div>
        <HeDivider />


        <div class="flex flex-col gap-4">
            <SettingsTitle>Allgemeine Einstellungen</SettingsTitle>
            <IodSelect label="Sprache" :modelValue="language" @update:modelValue="auth.setSettings('ui_language', $event, 'db')" :options="options_language"/>
            <IodSelect label="Zeitzone" :modelValue="timezone" @update:modelValue="auth.setSettings('ui_timezone', $event, 'db')" :options="options_timezone"/>
            <IodSelect label="Theme" :modelValue="theme" @update:modelValue="auth.setSettings('ui_theme', $event, 'db')" :options="options_theme"/>
        </div>
        <HeDivider />
        
        
        <div class="flex flex-col gap-4">
            <SettingsTitle>Kontosicherheit</SettingsTitle>
            <IodButton corner="pill" label="Passwort ändern" @click="changePasswordPopup.open()"/>
        </div>
        <HeDivider />


        <div class="flex flex-col gap-4">
            <SettingsTitle>Zwei Faktor</SettingsTitle>
            <div class="flex gap-4 items-center" v-if="auth.user?.has_tfa_totp_method_enabled">
                <IodButton v-if="auth.user?.default_tfa_method === 'totp'" class="flex-1" corner="pill" label="Auth-App" disabled v-tooltip="'Dies ist Ihre Standard-Methode'"/>
                <IodButton v-else class="flex-1" variant="contained" corner="pill" label="Auth-App als Standard festlegen" v-tooltip="'Als Standard-Methode festlegen'" @click="setDefaultTwoFactorMethod('totp')"/>
                <IodIconButton variant="contained" corner="pill" icon="close" v-tooltip="'Diese Zwei Faktor Methode löschen'" color-preset="error" @click="destroyTwoFactorMethod('totp')"/>
            </div>
            <IodButton v-else corner="pill" variant="contained" icon-left="screen_lock_portrait" label="Auth-App einrichten"  @click="twoFactorSetup.setupTotp()"/>
            <IodButton  v-if="auth.user?.has_tfa_enabled" corner="pill" variant="contained" icon-left="key" label="Backup-Codes Anzeigen" @click="twoFactorSetup.showBackup()"/>
        </div>
        <HeDivider />

        
        <div class="flex flex-col">
            <div class="flex items-center mb-2">
                <SettingsTitle class="flex-1">Benachrichtigungen</SettingsTitle>
                <b class="w-20 text-center">In-App</b>
                <b class="w-20 text-center">Email</b>
            </div>
            <div class="flex items-center" v-if="auth.can('system.view.users')">
                <b class="flex-1">Nutzer hat sich registriert</b>
                <span class="w-20 text-center">
                    <IodToggle :modelValue="auth.getSettings('notification_database_user_registered', false, 'db')" @update:modelValue="auth.setSettings('notification_database_user_registered', $event, 'db')"/>
                </span>
                <span class="w-20 text-center">
                    <IodToggle :modelValue="auth.getSettings('notification_mail_user_registered', false, 'db')" @update:modelValue="auth.setSettings('notification_mail_user_registered', $event, 'db')"/>
                </span>
            </div>
            <div class="flex items-center" v-if="auth.can(['system.view.users', 'system.enable.users'])">
                <b class="flex-1">Nutzer wartet auf eine Freigabe</b>
                <span class="w-20 text-center">
                    <IodToggle :modelValue="auth.getSettings('notification_database_user_verified', true, 'db')" @update:modelValue="auth.setSettings('notification_database_user_verified', $event, 'db')"/>
                </span>
                <span class="w-20 text-center">
                    <IodToggle :modelValue="auth.getSettings('notification_mail_user_verified', true, 'db')" @update:modelValue="auth.setSettings('notification_mail_user_verified', $event, 'db')"/>
                </span>
            </div>
        </div>
        <HeDivider />


        <div class="flex flex-col gap-4">
            <SettingsTitle>Abmelden</SettingsTitle>
            <IodButton corner="pill" variant="contained" color-preset="error" label="Abmelden" @click="auth.logout(route.query.return ?? auth.routes.authHome)"/>
        </div>

            
        <!-- <div class="flex flex-col gap-4">
            <SettingsTitle>Kontolöschung</SettingsTitle>
            <IodButton corner="pill" label="Konto löschen" color-preset="error" @click="deleteAccountPopup.open()"/>
        </div> -->



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
                        Sie sind dabei Ihr Konto zu löschen. Wenn Sie Ihr Konto löschen, werden ebenfalls all Ihre Daten gelöscht.<br><br>
                        <b>Eine Löschung kann nicht rückgängig gemacht werden!</b><br><br>
                        Bestätigen Sie die Kontolöschung, indem Sie Ihr aktuelles Passwort eingeben.
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
    const domain = useDomainStore()
    const route = useRoute()
    const NuxtLink = defineNuxtLink({})
    
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
                domain.fetchSettings()
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
