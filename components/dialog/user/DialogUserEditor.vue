<template>
    <IodPopup ref="popup" :title placement="right">
        <form class="flex flex-col p-4 pt-0 gap-4" @submit.prevent="save">
            <ErrorAlert :errors="form.errors" />

            <IodAlert type="error" v-if="form.blocked_at">
                Dieser Nutzer wurde gesperrt.<br>
                Grund: <b>{{ form.block_reason || 'Nicht angegeben' }}</b>
            </IodAlert>

            <div class="flex items-center gap-1 p-1 bg-background rounded-lg">
                <IodButton type="button" class="flex-1" variant="text" size="s" corner="m" normal-case label="Übersicht" @click="tab = 'overview'"/>
                <IodButton type="button" class="flex-1" variant="text" size="s" corner="m" normal-case label="Sicherheit" @click="tab = 'security'" :disabled="isNew"/>
                <IodButton type="button" class="flex-1" variant="text" size="s" corner="m" normal-case label="Aktionen" @click="tab = 'actions'" :disabled="isNew"/>
            </div>



            <template v-if="tab === 'overview'">
                <ProfileCard
                    v-show="!isNew"
                    allow-avatar-upload
                    allow-banner-upload
                    class="bg-background rounded-lg"
                    :title="fullname"
                    :avatar="form.avatar"
                    :banner="form.banner"
                    @upload:avatar="selectMedia('avatar')"
                    @upload:banner="selectMedia('banner')"
                />

                <input class="hidden" ref="mediaInput" type="file" @change="uploadMedia(($event.target as any).files[0])" />

                <div class="flex flex-col p-4 gap-4 bg-background rounded-lg">
                    <label class="flex flex-col gap-1">
                        <span class="px-1">Benutzername</span>
                        <IodInput class="input-s" v-model="form.username"/>
                    </label>
                    <label class="flex flex-col gap-1">
                        <span class="px-1">Email</span>
                        <IodInput class="input-s" v-model="form.email"/>
                    </label>
                    <label class="flex flex-col gap-1">
                        <span class="px-1">Vorname</span>
                        <IodInput class="input-s" v-model="form.firstname"/>
                    </label>
                    <label class="flex flex-col gap-1">
                        <span class="px-1">Nachname</span>
                        <IodInput class="input-s" v-model="form.lastname"/>
                    </label>
                    <label class="flex flex-col gap-1">
                        <span class="px-1">Organisation</span>
                        <IodInput class="input-s" v-model="form.organisation"/>
                    </label>
                    <HeDivider class="my-4"/>
                    <label class="flex flex-col gap-1">
                        <span class="px-1">Telefon</span>
                        <IodInput class="input-s" v-model="form.phone"/>
                    </label>
                </div>

                <IodButton class="!sticky bottom-4" type="submit" label="Speichern" :loading="form.processing"/>
            </template>



            <template v-if="tab === 'security'">
                <div class="flex flex-col p-4 gap-4 bg-background rounded-lg">
                    <ContextMenuLabel label="Berechtigungen"/>
                    <div class="flex flex-wrap gap-2">
                        <VDropdown placement="left">
                            <IodIconButton type="button" class="!w-10" size="xs" corner="m" icon="add" v-tooltip="'Rollen hinzufügen'" />
    
                            <template #popper>
                                <DialogSearchRoles @select="assignRole($event[0])" />
                            </template>
                        </VDropdown>
    
                        <IodButton
                            v-for="role in form.roles"
                            size="xs"
                            corner="m"
                            type="button"
                            variant="contained"
                            normal-case
                            v-tooltip='`"${role.name}" Rolle entfernen`'
                            :icon-left="role.icon"
                            :label="role.name"
                            @click="removeRole(role)"
                        />
                    </div>
                </div>

                <div class="flex flex-col p-4 gap-4 bg-background rounded-lg">
                    <h5 class="m-0 font-medium">API Zugriff</h5>

                    <div class="flex flex-col select-none" v-if="form.tokens.length">
                        <div class="flex items-center gap-4 px-3 h-12 bg-background-soft rounded-lg">
                            <span class="flex-1">Name</span>
                            <span class="w-48">Erstellt</span>
                            <span class="w-48">Ablaufdatum</span>
                            <span class="w-8"></span>
                        </div>
                        <div class="flex items-center gap-4 px-3 h-12" v-for="token in form.tokens">
                            <span class="flex-1">{{ token.name }}</span>
                            <span class="w-48" v-tooltip="token.created_at ? $dayjs(token.created_at).format('DD.MM.YYYY HH:mm') : '---'">{{ token.created_at ? $dayjs(token.created_at).fromNow() : '---' }}</span>
                            <span class="w-48" v-tooltip="token.expires_at ? $dayjs(token.expires_at).format('DD.MM.YYYY HH:mm') : '---'">{{ token.expires_at ? $dayjs(token.expires_at).fromNow() : 'nie' }}</span>
                            <IodIconButton type="button" v-tooltip="'Token löschen'" icon="delete" size="s" corner="pill" variant="contained" color-preset="error" @click="deleteToken(token)"/>
                        </div>
                    </div>

                    <IodAlert type="placeholder" class="h-40 border-2" text="Es wurden noch keine API-Tokens angelegt" v-else />

                    <IodButton type="button" class="mr-auto" label="Token hinzufügen" color-preset="info" size="xs" corner="m" variant="text" normal-case @click="createTokenPopup.open()"/>
                </div>

                <ContextMenu class="bg-background rounded-lg">
                    <ContextMenuItem is="button" type="button" icon="lock" label="Passwort ändern" @click="changePasswordPopup.open()"/>
                    <ContextMenuItem is="button" type="button" icon="lock_reset" label="Passwort-Änderung anfordern" @click="requirePasswordChange(!form.requires_password_change)">
                        <template #right>
                            <IodToggle type="switch" class="!p-0 !pr-4" :modelValue="!!form.requires_password_change"/>
                        </template>
                    </ContextMenuItem>
                    <ContextMenuItem is="button" type="button" icon="shield_lock" label="2FA-Einrichtung anfordern" @click="requireTwoFactor(!form.requires_two_factor)">
                        <template #right>
                            <IodToggle type="switch" class="!p-0 !pr-4" :modelValue="!!form.requires_two_factor"/>
                        </template>
                    </ContextMenuItem>
                </ContextMenu>
            </template>



            <template v-if="tab === 'actions'">
                <ContextMenu class="bg-background rounded-lg">
                    <ContextMenuLabel label="Email"/>
                    <ContextMenuItem is="button" type="button" icon="mail" label="Bestätigen" @click="verifyEmail(true)" v-show="!form.email_verified_at"/>
                    <ContextMenuItem is="button" type="button" icon="mail" color="var(--color-error)" label="Bestätigung zurücksetzen" @click="verifyEmail(false)" v-show="form.email_verified_at"/>
                    <ContextMenuItem is="button" type="button" icon="send" label="Bestätigungsmail versenden" @click="sendVerificationEmail()" :disabled="!!form.email_verified_at"/>
                    
                    <ContextMenuDivider />
                    
                    <ContextMenuLabel label="Telefon"/>
                    <ContextMenuItem is="button" type="button" icon="phone" label="Bestätigen" @click="verifyPhone(true)" v-show="!form.phone_verified_at"/>
                    <ContextMenuItem is="button" type="button" icon="phone" color="var(--color-error)" label="Bestätigung zurücksetzen" @click="verifyPhone(false)" v-show="form.phone_verified_at"/>
                    
                    <ContextMenuDivider />
                    
                    <ContextMenuLabel label="Nutzer"/>
                    <ContextMenuItem is="button" type="button" icon="verified" label="Freigeben" @click="enableUser(true)" v-show="!form.enabled_at"/>
                    <ContextMenuItem is="button" type="button" icon="verified" color="var(--color-error)" label="Freigabe zurücksetzen" @click="enableUser(false)" v-show="form.enabled_at"/>
                    <ContextMenuItem is="button" type="button" icon="do_not_disturb_on" color="var(--color-error)" label="Sperren" @click="blockUserPopup.open()" v-show="!form.blocked_at"/>
                    <ContextMenuItem is="button" type="button" icon="do_not_disturb_on" label="Entsperren" @click="unblockUser()" v-show="form.blocked_at"/>
                    <ContextMenuItem is="button" type="button" icon="delete" label="Löschen" color="var(--color-error)" @click="destroy()" />
                </ContextMenu>
            </template>
        </form>



        <IodPopup ref="changePasswordPopup" title="Passwort ändern" max-width="500px" @open="changePasswordForm.reset">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="changePassword">
                <ErrorAlert :errors="changePasswordForm.errors"/>
                <HeFlex gap="1rem">
                    <IodInput v-model="changePasswordForm.password" show-score :score-function="useZxcvbn()" label="Neues Passwort" type="password"/>
                </HeFlex>
                <IodButton label="Passwort ändern" corner="pill" size="l" :loading="changePasswordForm.processing"/>
            </HeFlex>
        </IodPopup>

        <IodPopup ref="blockUserPopup" title="Nutzer sperren" max-width="500px" @open="blockUserForm.reset">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="blockUser">
                <ErrorAlert :errors="blockUserForm.errors"/>
                <HeFlex gap="1rem">
                    <IodInput v-model="blockUserForm.block_reason" label="Grund" type="text"/>
                </HeFlex>
                <IodButton label="Nutzer sperren" corner="pill" size="l" color-preset="error" :loading="blockUserForm.processing"/>
            </HeFlex>
        </IodPopup>

        <IodPopup ref="createTokenPopup" title="API-Token erstellen" max-width="500px" @open="createTokenForm.reset">
            <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="createToken" v-if="!createTokenForm.token">
                <ErrorAlert :errors="createTokenForm.errors"/>
                <HeFlex gap="1rem">
                    <IodInput v-model="createTokenForm.name" label="Anzeigename"/>
                </HeFlex>
                <IodButton label="API-Token erstellen" corner="pill" size="l" :loading="createTokenForm.processing"/>
            </HeFlex>

            <HeFlex gap="2.5rem" padding="1.5rem" v-else>
                <IodInput v-model="createTokenForm.token" label="API-Token" readonly>
                    <template #right>
                        <IodIconButton type="button" corner="pill" size="s" variant="text" icon="content_copy" v-tooltip="'Token in die Zwischenablage kopieren'" @click="copyToClipboard(createTokenForm.token)"/>
                    </template>
                </IodInput>
                <IodButton type="button" label="Schließen" corner="pill" size="l" variant="contained" @click="createTokenPopup.close()"/>
            </HeFlex>
        </IodPopup>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { Country } from '~/types/units'
    import type { BasicRole } from '~/types/role'
    import _ from 'lodash'
    import { toast } from 'vue3-toastify'
    
    // DOM
    const popup = ref()

    // DATA
    const form = useForm({})
    const tab = ref('overview')

    // PROPS & EMITS
    const emits = defineEmits([ 'change' ])

    // COMPUTED
    const isNew = computed(() => !form.id)
    const title = computed(() => isNew.value ? 'Nutzer erstellen' : 'Nutzer bearbeiten')
    const fullname = computed(() => [form.prefix, form.firstname, form.middlename, form.lastname, form.suffix].filter(i => i).join(' ') || 'Unbenannt')
    const save = isNew.value ? store : update

    // EXPOSE
    defineExpose({ open })



    // General
    function reset() {
        form.defaults({
            id: null,
            avatar: null,
            banner: null,
            username: '',
            email: '',
            phone: '',

            requires_password_change: false,
            requires_two_factor: false,
            email_verified_at: '',
            phone_verified_at: '',
            last_login_at: '',
            enabled_at: '',
            blocked_at: '',
            block_reason: '',
            deleted_at: '',
            created_at: '',
            updated_at: '',

            name: '',
            salutation: '',
            prefix: '',
            firstname: '',
            middlename: '',
            lastname: '',
            suffix: '',
            legalname: '',
            nickname: '',

            organisation: '',
            department: '',
            job_title: '',

            customer_id: '',
            employee_id: '',
            member_id: '',

            notes: '',
            
            roles: [],

            tokens: [],
        }).reset()
    }
    
    function open(id?: string) {
        reset()
        if (id) fetch(id)
        popup.value.open()
    }


    // API
    function fetch(id: string) {
        form.get(apiRoute('/api/users/:id', { id }), {
            onSuccess(response: any) {
                form.defaults(response.data).reset()
            },
        })
    }

    function store() {
        form.post(apiRoute('/api/users'), {
            onSuccess(response: any) {
                form.defaults(response.data).reset()
                toast.success('Nutzer wurde erstellt')
                emits('change')
            },
        })
    }

    function update() {
        form.patch(apiRoute('/api/users/:id', { id: form.id }), {
            onSuccess(response: any) {
                form.defaults(response.data).reset()
                toast.success('Nutzer wurde aktualisiert')
                emits('change')
            },
        })
    }

    function destroy() {
        form.delete(apiRoute('/api/users/:id', { id: form.id }), {
            onSuccess(response: any) {
                popup.value.close()
                toast.info('Nutzer wurde gelöscht')
                emits('change')
            },
        })
    }

    async function sendVerificationEmail() {
        await useAxios().post(apiRoute('/api/users/:id/send-verification-email', { id: form.id }))
        toast.success('E-Mail wurde verschickt')
        fetch()
    }

    async function verifyEmail(status: boolean) {
        form.email_verified_at = status
        await useAxios().patch(apiRoute('/api/users/:id/verify-email', { id: form.id }), { email_verified: status })
        fetch()
    }

    async function verifyPhone(status: boolean) {
        form.phone_verified_at = status
        await useAxios().patch(apiRoute('/api/users/:id/verify-phone', { id: form.id }), { phone_verified: status })
        fetch()
    }

    async function enableUser(status: boolean) {
        form.enabled_at = status
        await useAxios().patch(apiRoute('/api/users/:id/enable', { id: form.id }), { enabled: status })
        fetch()
    }

    async function requirePasswordChange(status: boolean) {
        form.requires_password_change = status
        await useAxios().patch(apiRoute('/api/users/:id/require-password-change', { id: form.id }), { requires_password_change: status })
        fetch()
    }

    async function requireTwoFactor(status: boolean) {
        form.requires_two_factor = status
        await useAxios().patch(apiRoute('/api/users/:id/require-two-factor', { id: form.id }), { requires_two_factor: status })
        fetch()
    }



    // Roles
    function assignRole(roles: BasicRole|BasicRole[]) {
        if (!Array.isArray(roles)) roles = [roles]

        form.roles.push(...roles)

        useAxios()
        .put('/api/users/roles', {
            items: [form.id],
            roles: roles.map(item => item.name),
        })
        .then(response => {
            toast.success(`Rollen wurden zugewiesen: ${roles.map(item => '"'+item.name+'"').join(', ')}`)
        })
        .catch(error => {
            toast.error(error.response.data.message)
        })
    }

    function removeRole(roles: BasicRole|BasicRole[]) {
        if (!Array.isArray(roles)) roles = [roles]

        roles.forEach((role: BasicRole) => {
            form.roles = form.roles.filter((item: BasicRole) => item.id !== role.id)
        })

        useAxios()
        .delete(apiRoute('/api/users/roles', {
            items: [form.id],
            roles: roles.map(item => item.name),
        }))
        .then(response => {
            toast.success(`Rollen wurden entfernt: ${roles.map(item => '"'+item.name+'"').join(', ')}`)
        })
        .catch(error => {
            toast.error(error.response.data.message)
        })
    }



    // Media
    const mediaType = ref('avatar')

    function selectMedia(type: 'avatar' | 'banner'){
        mediaType.value = type
        mediaInput.value.click()
    }

    async function uploadMedia(file: any) {
        if (!file) return
        await useAxios().postForm(apiRoute('/api/users/:id/:media', { id: form.id, media: mediaType.value }), {file})
        mediaInput.value.value = null
        fetch()
    }



    // Change password
    const changePasswordPopup = ref()
    const changePasswordForm = useForm({
        password: '',
    })

    function changePassword() {
        changePasswordForm.patch(apiRoute('/api/users/:id/password', { id: form.id }), {
            onSuccess() {
                changePasswordPopup.value?.close()
                toast.success('Passwort geändert')
            },
        })
    }



    // Block
    const blockUserPopup = ref()
    const blockUserForm = useForm({
        blocked: true,
        block_reason: '',
    })

    function blockUser() {
        blockUserForm.patch(apiRoute('/api/users/:id/block', { id: form.id }), {
            onSuccess() {
                blockUserPopup.value?.close()
                fetch()
            },
        })
    }

    function unblockUser() {
        blockUserForm.blocked = false
        blockUser()
    }



    // Token
    const createTokenPopup = ref()
    const createTokenForm = useForm({
        name: '',
        token: '',
    })

    function createToken() {
        createTokenForm.post(apiRoute('/api/users/:id/token', { id: form.id }), {
            onSuccess(data: any) {
                createTokenForm.reset()
                createTokenForm.token = data.token
                fetch()
                toast.success('Token erstellt')
            },
        })
    }

    function deleteToken(token: any) {
        useForm({}).delete(apiRoute('/api/users/:id/token/:token', { id: form.id, token: token.id }), {
            onSuccess() {
                fetch()
                toast.success('Token gelöscht')
            },
        })
    }
</script>

<style lang="sass" scoped>
</style>