<template>
    <NuxtLayout name="guest-default" :scope pageClass="!p-0 !gap-0 !overflow-hidden" pageTitle="Profil Einstellungen">
        <TransitionGroup :name="'slide-'+direction" tag="div" class="relative">
            <div class="page" v-if="page === 'overview'" key="overview">
                <ProfileCard
                    v-if="auth.user"
                    class="rounded-t-2xl border-b"
                    :allow-avatar-upload="domain.policy('allow_avatar_upload')"
                    :allow-banner-upload="domain.policy('allow_banner_upload')"
                    :title="auth.user.name || ''"
                    :avatar="auth.user.avatar || ''"
                    :banner="auth.user.banner || ''"
                    :subtitle="auth.user.username || auth.user.email || ''"
                    @upload:avatar="selectMedia('avatar')"
                    @upload:banner="selectMedia('banner')"
                />
                <div class="flex items-center px-4 min-h-[4.5rem]" v-else>
                    <h1 class="font-medium text-2xl m-0">Ihr Profil</h1>
                </div>
                
                <input class="hidden" ref="mediaInput" type="file" pattern="image/*" @change="uploadMedia(($event.target as any).files[0])" />
    
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
                    <ContextMenuDivider v-if="domain.policy('allow_name_change') || domain.policy('allow_username_change')"/>
                    <ContextMenuItem is="button" icon="signature" @click="changeNamePopup.open()" v-if="domain.policy('allow_name_change')">Namen ändern</ContextMenuItem>
                    <ContextMenuItem is="button" icon="identity_platform" @click="changeUsernamePopup.open()" v-if="domain.policy('allow_username_change')">Benutzernamen ändern</ContextMenuItem>
                    <ContextMenuDivider />
                    <ContextMenuItem is="button" icon="logout" color="var(--color-error)" @click="auth.logout(logoutDestination || '')">Ausloggen</ContextMenuItem>
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



        <IodPopup ref="changeNamePopup" title="Namen ändern" max-width="500px" @open="changeNameForm.reset">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="changeName">
                <ErrorAlert :errors="changeNameForm.errors"/>
                <HeFlex gap="1rem">
                    <IodInput label="Vorname" v-model="changeNameForm.firstname"/>
                    <IodInput label="Nachname" v-model="changeNameForm.lastname"/>
                </HeFlex>
                <IodButton label="Namen ändern" corner="pill" size="l" :loading="changeNameForm.processing"/>
            </HeFlex>
        </IodPopup>

        <IodPopup ref="changeUsernamePopup" title="Benutzernamen ändern" max-width="500px" @open="changeUsernameForm.reset">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="changeUsername">
                <ErrorAlert :errors="changeUsernameForm.errors"/>
                <HeFlex gap="1rem">
                    <IodInput label="Benutzername" v-model="changeUsernameForm.username"/>
                </HeFlex>
                <IodButton label="Benutzernamen ändern" corner="pill" size="l" :loading="changeUsernameForm.processing"/>
            </HeFlex>
        </IodPopup>

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

    const logoutDestination = computed<string|null>(() => {
        if ((route.query?.return as string)?.startsWith(runtimeConfig.public.websiteUrl)) {
            return runtimeConfig.public.websiteUrl
        }
        
        return null
    })



    // START: Navigation
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
    // END: Navigation



    // START: Appearence
    const theme = computed(() => auth.user?.settings?.ui_theme ?? 'light')
    // END: Appearence



    // START: Media
    type MediaType = 'avatar' | 'banner'
    const mediaInput = ref()
    const mediaType = ref<MediaType>('avatar')

    function selectMedia(type: MediaType){
        mediaType.value = type
        mediaInput.value.click()
    }

    async function uploadMedia(file: any) {
        if (!file) return
        await useAxios().postForm(apiRoute('/api/user/:media', { media: mediaType.value }), {file})
        await auth.fetchSession()
        await domain.fetchSettings()
        toast.success('Profil gespeichert')
        mediaInput.value.value = null
    }
    // END: Media



    // START: Change name
    const changeNamePopup = ref()
    const changeNameForm = useForm({
        firstname: auth.user?.firstname || '',
        lastname: auth.user?.lastname || '',
    })

    function changeName() {
        changeNameForm.patch('/api/user/name', {
            async onSuccess() {
                toast.success('Namen geändert')
                changeNamePopup.value.close()
                
                await auth.fetchSession()
                changeNameForm.defaults({
                    firstname: auth.user?.firstname || '',
                    lastname: auth.user?.lastname || '',
                })
            },
        })
    }
    // END: Change name



    // START: Change username
    const changeUsernamePopup = ref()
    const changeUsernameForm = useForm({
        username: auth.user?.username || '',
    })

    function changeUsername() {
        changeUsernameForm.patch('/api/user/username', {
            async onSuccess() {
                toast.success('Benutzername geändert')
                changeUsernamePopup.value.close()

                await auth.fetchSession()
                changeUsernameForm.defaults({
                    username: auth.user?.username || ''
                })
            }
        })
    }
    // END: Change username



    // START: Change password
    const changePasswordPopup = ref()
    const changePasswordForm = useForm({
        password: '',
        new_password: '',
    })

    function changePassword() {
        changePasswordForm.patch('/api/user/password', {
            onSuccess() {
                toast.success('Passwort geändert')
                changePasswordPopup.value.close()
            },
        })
    }
    // END: Change password



    // START: 2FA
    const twoFactorSetup = ref()

    function setDefaultTwoFactorMethod(method: string) {
        useForm({}).put(`/api/user/two-factor/default/${method}`, {
            onSuccess() {
                auth.fetchSession()
            }
        })
    }

    function destroyTwoFactorMethod(method: string) {
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

    function deleteAccount() {
        deleteAccountForm.delete('/api/user', {
            onSuccess() {
                auth.logout()
                toast.success('Ihr Konto wird nun gelöscht')
                deleteAccountPopup.value.close()
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
