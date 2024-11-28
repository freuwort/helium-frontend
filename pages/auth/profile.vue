<template>
    <NuxtLayout name="guest-default" :scope pageClass="!p-0 !gap-0 !overflow-hidden" pageTitle="Profil Einstellungen">
        <TransitionGroup :name="'slide-'+direction" tag="div" class="relative">
            <div class="page" v-if="page === 'overview'" key="overview">
                <div class="flex items-center px-4 min-h-[4.5rem]">
                    <h1 class="font-medium text-2xl m-0">Ihr Profil</h1>
                </div>
    
                <ContextMenu>
                    <ContextMenuItem is="button" icon="person" show-chevron @click="navigateForward('account')">Konto Informationen</ContextMenuItem>
                    <ContextMenuItem is="button" icon="format_paint" show-chevron @click="navigateForward('theme')">Erscheinungsbild</ContextMenuItem>
                    <ContextMenuItem is="button" icon="shield" show-chevron @click="navigateForward('security')">Kontosicherheit</ContextMenuItem>
                    <ContextMenuItem is="button" icon="notifications" show-chevron @click="navigateForward('notifications')">Benachrichtigungen</ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem :is="NuxtLink" icon="exit_to_app" :to="returnDestination">Profil verlassen und zurück</ContextMenuItem>
                </ContextMenu>
            </div>
            
            
            <div class="page" v-if="page === 'account'" key="account">
                <div class="flex items-center px-4 min-h-[4.5rem]">
                    <h1 class="font-medium text-2xl m-0">Konto Informationen</h1>
                </div>
                
                <ContextMenu>
                    <ContextMenuItem is="button" icon="west" @click="navigateBackward('overview')">Zurück</ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem is="button" icon="logout" color="var(--color-error)" @click="auth.logout(logoutDestination)">Ausloggen</ContextMenuItem>
                </ContextMenu>
            </div>
    
    
            <div class="page" v-if="page === 'theme'" key="theme">
                <div class="flex items-center px-4 min-h-[4.5rem]">
                    <h1 class="font-medium text-2xl m-0">Erscheinungsbild</h1>
                </div>
    
                <ContextMenu>
                    <ContextMenuItem is="button" icon="west" @click="navigateBackward('overview')">Zurück</ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuLabel label="Theme" />
                    <ContextMenuItem is="button" icon="light_mode" :active="theme === 'light'" @click="auth.setSettings('ui_theme', 'light', 'db')">
                        Helles Theme
                        <template #right v-if="theme === 'light'"><IodIcon class="mr-4" icon="check"/></template>
                    </ContextMenuItem>
                    <ContextMenuItem is="button" icon="dark_mode" :active="theme === 'dark'" @click="auth.setSettings('ui_theme', 'dark', 'db')">
                        Dunkles Theme
                        <template #right v-if="theme === 'dark'"><IodIcon class="mr-4" icon="check"/></template>
                    </ContextMenuItem>
                    <ContextMenuItem is="button" icon="brightness_auto" :active="theme === 'system'" @click="auth.setSettings('ui_theme', 'system', 'db')">
                        System Theme
                        <template #right v-if="theme === 'system'"><IodIcon class="mr-4" icon="check"/></template>
                    </ContextMenuItem>
                </ContextMenu>
    
            </div>
    
    
            <div class="page" v-if="page === 'security'" key="security">
                <div class="flex items-center px-4 min-h-[4.5rem]">
                    <h1 class="font-medium text-2xl m-0">Kontosicherheit</h1>
                </div>
                
                <ContextMenu>
                    <ContextMenuItem is="button" icon="west" @click="navigateBackward('overview')">Zurück</ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem is="button" icon="key" @click="changePasswordPopup.open()">Passwort ändern</ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuLabel label="Zweiter Faktor" />
                    <template v-if="auth.user?.has_tfa_totp_method_enabled">
                        <ContextMenuItem is="div" icon="encrypted">
                            <span>Authenticator-App</span>

                            <template #right>
                                <IodButton
                                    is="div"
                                    class="mr-2"
                                    variant="contained"
                                    corner="pill"
                                    size="xs"
                                    color-preset="success"
                                    label="Standard Methode"
                                    normal-case
                                    border
                                    v-if="auth.user?.default_tfa_method === 'totp'"
                                />
                                <IodButton
                                    is="button"
                                    type="button"
                                    class="mr-2"
                                    variant="contained"
                                    corner="pill"
                                    size="xs"
                                    normal-case
                                    label="Als Standard festlegen"
                                    @click="setDefaultTwoFactorMethod('totp')"
                                    v-else
                                />
                                <IodIconButton
                                    type="button"
                                    class="mr-2"
                                    variant="contained"
                                    corner="pill"
                                    size="s"
                                    icon="encrypted_off"
                                    color-preset="error"
                                    v-tooltip="'Diese Methode entfernen'"
                                    @click="destroyTwoFactorMethod('totp')"
                                />
                            </template>
                        </ContextMenuItem>
                    </template>
                    <ContextMenuItem v-else is="button" icon="encrypted_add" @click="twoFactorSetup.setupTotp()">
                        <span>Authenticator-App einrichten</span>
                    </ContextMenuItem>

                    <ContextMenuItem v-if="auth.user?.has_tfa_enabled"is="button" icon="visibility_lock" @click="twoFactorSetup.showBackup()">Backup Codes anzeigen</ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem is="button" icon="logout" color="var(--color-error)" @click="deleteAccountPopup.open()">Konto löschen</ContextMenuItem>
                </ContextMenu>
            </div>
    
    
            <div class="page" v-if="page === 'notifications'" key="notifications">
                <div class="flex items-center px-4 min-h-[4.5rem]">
                    <h1 class="font-medium text-2xl m-0">Benachrichtigungen</h1>
                </div>
                <ContextMenu>
                    <ContextMenuItem is="button" icon="west" @click="navigateBackward('overview')">Zurück</ContextMenuItem>
                    <ContextMenuDivider />
                    <template v-if="auth.can('system.view.users')">
                        <ContextMenuLabel label="Nutzer Registrierungen – administrativ" />
                        <ContextMenuItem is="button" icon="inbox" @click="auth.setSettings('notification_database_user_registered', !auth.getSettings('notification_database_user_registered', false, 'db'), 'db')">
                            In-App
                            <template #right>
                                <IodToggle type="switch" readonly :modelValue="auth.getSettings('notification_database_user_registered', false, 'db')"/>
                            </template>
                        </ContextMenuItem>
                        <ContextMenuItem is="button" icon="mail" @click="auth.setSettings('notification_mail_user_registered', !auth.getSettings('notification_mail_user_registered', false, 'db'), 'db')">
                            Email
                            <template #right>
                                <IodToggle type="switch" readonly :modelValue="auth.getSettings('notification_mail_user_registered', false, 'db')"/>
                            </template>
                        </ContextMenuItem>
                    </template>
                    <ContextMenuDivider />
                    <template v-if="auth.can(['system.view.users', 'system.enable.users'])">
                        <ContextMenuLabel label="Nutzer Freigaben – administrativ" />
                        <ContextMenuItem is="button" icon="inbox" @click="auth.setSettings('notification_database_user_verified', !auth.getSettings('notification_database_user_verified', true, 'db'), 'db')">
                            In-App
                            <template #right>
                                <IodToggle type="switch" readonly :modelValue="auth.getSettings('notification_database_user_verified', true, 'db')"/>
                            </template>
                        </ContextMenuItem>
                        <ContextMenuItem is="button" icon="mail" @click="auth.setSettings('notification_mail_user_verified', !auth.getSettings('notification_mail_user_verified', true, 'db'), 'db')">
                            Email
                            <template #right>
                                <IodToggle type="switch" readonly :modelValue="auth.getSettings('notification_mail_user_verified', true, 'db')"/>
                            </template>
                        </ContextMenuItem>
                    </template>
                </ContextMenu>
            </div>
        </TransitionGroup>



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
    const runtimeConfig = useRuntimeConfig()
    
    const scope = 'view_admin_profile_show'



    const returnDestination = computed(() => {
        if (route.query.return) {
            return route.query.return
        }

        return auth.routes.authHome
    })

    const logoutDestination = computed(() => {
        if (route.query?.return?.startsWith(runtimeConfig.public.websiteUrl)) {
            return runtimeConfig.public.websiteUrl
        }
        
        return null
    })



    const page = ref('overview')
    const direction = ref('forwards')

    function navigateForward(p: string) {
        page.value = p
        direction.value = 'forwards'
    }

    function navigateBackward(p: string) {
        page.value = p
        direction.value = 'backwards'
    }



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

<style lang="sass" scoped>
    .slide-forwards-enter-active,
    .slide-backwards-enter-active,
    .slide-forwards-leave-active,
    .slide-backwards-leave-active,
    .slide-forwards-move,
    .slide-backwards-move
        transition: all 200ms ease

    .slide-forwards-leave-active,
    .slide-backwards-leave-active
        position: absolute !important

    .slide-forwards-enter-from,
    .slide-backwards-leave-to
        transform: translateX(3rem)
        opacity: 0

    .slide-forwards-leave-to,
    .slide-backwards-enter-from
        transform: translateX(-3rem)
        opacity: 0



    .page
        width: 100%
        display: flex
        flex-direction: column
</style>
