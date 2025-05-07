<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Nutzer Editor">
        <HeCard is="form" @submit.prevent="save">
            <ProfileCard
                v-show="!!form.id"
                allow-avatar-upload
                allow-banner-upload
                class="border-b"
                :title="fullname"
                :avatar="form.avatar"
                :banner="form.banner"
                :subtitle="form.username"
                @upload:avatar="selectMedia('avatar')"
                @upload:banner="selectMedia('banner')"
            />

            <input class="hidden" ref="mediaInput" type="file" @change="uploadMedia(($event.target as any).files[0])" />
            
            <div class="flex items-center p-4 border-b bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/users"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex padding="1.5rem 1rem" :gap="3">
                <ErrorAlert :errors="form.errors" />

                <IodAlert type="error" v-if="form.blocked_at">
                    <div class="mb-2">
                        Dieser Nutzer wurde gesperrt.<br>
                        Grund: <b>{{ form.block_reason || 'Nicht angegeben' }}</b>
                    </div>
                    <IodButton type="button" size="s" corner="l" label="Nutzer entsperren" color-preset="error" :loading="blockUserForm.processing" @click="unblockUser" />
                </IodAlert>

                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Konto</h5>
                        <HeSpacer />
                        <VDropdown placement="bottom-end">
                            <IodButton type="button" label="Aktionen" icon-right="expand_more" size="s" corner="pill" variant="contained"/>
                            <template #popper>
                                <ContextMenu class="min-w-96">
                                    <ContextMenuLabel label="Zugriff"/>
                                    <ContextMenuItem is="button" type="button" icon="verified" label="Nutzer freigeben" @click="enableUser(!form.enabled_at)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.enabled_at"/>
                                        </template>
                                    </ContextMenuItem>
                                    <ContextMenuItem is="button" type="button" icon="do_not_disturb_on" color="var(--color-error)" label="Nutzer sperren" @click="blockUserPopup.open()" v-show="!form.blocked_at" v-close-popper/>
                                    <ContextMenuItem is="button" type="button" icon="do_not_disturb_off" color="var(--color-success)" label="Nutzer entsperren" @click="unblockUser()" v-show="form.blocked_at" v-close-popper/>
                                    
                                    <ContextMenuDivider />
                                    
                                    <ContextMenuLabel label="Email"/>
                                    <ContextMenuItem is="button" type="button" icon="send" label="Bestätigungsmail versenden" @click="sendVerificationEmail()" :disabled="!!form.email_verified_at" v-close-popper/>
                                    <ContextMenuItem is="button" type="button" icon="mail" label="Email-Adresse bestätigen" @click="verifyEmail(!form.email_verified_at)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.email_verified_at"/>
                                        </template>
                                    </ContextMenuItem>
                                    
                                    <ContextMenuDivider />
                                    
                                    <ContextMenuLabel label="Telefon"/>
                                    <ContextMenuItem is="button" type="button" icon="phone" label="Telefonnummer bestätigen" @click="verifyPhone(!form.phone_verified_at)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.phone_verified_at"/>
                                        </template>
                                    </ContextMenuItem>

                                    <ContextMenuDivider />
                                    
                                    <ContextMenuLabel label="Sicherheit"/>
                                    <ContextMenuItem is="button" type="button" icon="lock" label="Passwort ändern" @click="changePasswordPopup.open()" v-close-popper/>
                                    <ContextMenuItem is="button" type="button" icon="lock_reset" label="Passwort-Änderung anfordern" @click="requirePasswordChange(!form.requires_password_change)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.requires_password_change"/>
                                        </template>
                                    </ContextMenuItem>
                                    <ContextMenuItem is="button" type="button" icon="shield_lock" label="2FA-Einrichtung anfordern" @click="requireTwoFactor(!form.requires_two_factor)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.requires_two_factor"/>
                                        </template>
                                    </ContextMenuItem>
                                </ContextMenu>
                            </template>
                        </VDropdown>
                    </HeFlex>
                    <IodInput label="Benutzername" v-model="form.username"/>
                    <IodInput label="Email" v-model="form.email"/>
                    <IodInput label="Telefon" v-model="form.phone"/>
                </HeFlex>

                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Berechtigungen</h5>
                    <div class="flex flex-wrap gap-2">
                        <VDropdown placement="left">
                            <IodIconButton type="button" class="!w-12" size="s" corner="pill" icon="add" v-tooltip="'Rollen hinzufügen'" />

                            <template #popper>
                                <DialogSearchRoles @select="assignRole($event[0])" />
                            </template>
                        </VDropdown>

                        <IodButton
                            v-for="role in form.roles"
                            size="s"
                            corner="pill"
                            type="button"
                            variant="contained"
                            class="!normal-case !tracking-normal"
                            v-tooltip='`"${role.name}" Rolle entfernen`'
                            :icon-left="role.icon"
                            :label="role.name"
                            @click="removeRole(role)"
                        />
                    </div>
                </HeFlex>

                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">API Zugriff</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Token hinzufügen" icon-right="add" size="s" corner="pill" variant="contained" @click="createTokenPopup.open()"/>
                    </HeFlex>

                    <div class="flex flex-col select-none" v-if="form.tokens.length">
                        <div class="flex items-center gap-4 px-3 h-12 bg-background-soft rounded-lg">
                            <span class="flex-1">Name</span>
                            <span class="w-48">Erstellt</span>
                            <span class="w-48">Ablaufdatum</span>
                            <span class="w-8"></span>
                        </div>
                        <div class="flex items-center gap-4 px-3 h-12" v-for="token in form.tokens">
                            <span class="flex-1">{{ token.name }}</span>
                            <span class="w-48" v-tooltip="token.created_at ? dayjs(token.created_at).format('DD.MM.YYYY HH:mm') : '---'">{{ token.created_at ? dayjs(token.created_at).fromNow() : '---' }}</span>
                            <span class="w-48" v-tooltip="token.expires_at ? dayjs(token.expires_at).format('DD.MM.YYYY HH:mm') : '---'">{{ token.expires_at ? dayjs(token.expires_at).fromNow() : 'nie' }}</span>
                            <IodIconButton type="button" v-tooltip="'Token löschen'" icon="delete" size="s" corner="pill" variant="contained" color-preset="error" @click="deleteToken(token)"/>
                        </div>
                    </div>

                    <IodAlert type="placeholder" class="h-40 border-2" text="Es wurden noch keine API-Tokens angelegt" v-else />
                </HeFlex>



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Identifikation</h5>
                    <IodInput label="Kunden-Nr." v-model="form.customer_id"/>
                    <IodInput label="Personal-Nr." v-model="form.employee_id"/>
                    <IodInput label="Mitglieds-Nr." v-model="form.member_id"/>
                </HeFlex>

                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Name</h5>
                    <IodInput label="Anrede" v-model="form.salutation"/>
                    <IodInput label="Präfix" v-model="form.prefix"/>
                    <IodInput label="Vorname" v-model="form.firstname"/>
                    <IodInput label="Zweiter Vorname" v-model="form.middlename"/>
                    <IodInput label="Nachname" v-model="form.lastname"/>
                    <IodInput label="Suffix" v-model="form.suffix"/>
                    <IodInput label="Rechtlicher Name" v-model="form.legalname"/>
                    <IodInput label="Spitzname" v-model="form.nickname"/>

                    <VDropdown>
                        <IodInput type="text" label="Hauptadresse" icon-right="location_on" :modelValue="stringFromAddress(form.main_address)" readonly/>
                        <template #popper><IodAddressPicker v-model="form.main_address"/></template>
                    </VDropdown>

                    <VDropdown>
                        <IodInput type="text" label="Rechnungsadresse" icon-right="location_on" :modelValue="stringFromAddress(form.billing_address)" readonly/>
                        <template #popper><IodAddressPicker v-model="form.billing_address"/></template>
                    </VDropdown>

                    <VDropdown>
                        <IodInput type="text" label="Lieferadresse" icon-right="location_on" :modelValue="stringFromAddress(form.shipping_address)" readonly/>
                        <template #popper><IodAddressPicker v-model="form.shipping_address"/></template>
                    </VDropdown>
                </HeFlex>

                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Arbeit</h5>
                    <IodInput label="Organisation" v-model="form.organisation"/>
                    <IodInput label="Abteilung" v-model="form.department"/>
                    <IodInput label="Titel" v-model="form.job_title"/>
                </HeFlex>
            </HeFlex>
        </HeCard>



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
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import _ from 'lodash'
    import { toast } from 'vue3-toastify'
    import type { Country } from '~/types/units'
    import type { BasicRole } from '~/types/role'
import dayjs from '#build/dayjs.imports.mjs';

    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_users_show'

    

    // Item id
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
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
    })

    const fullname = computed(() => {
        return [form.prefix, form.firstname, form.middlename, form.lastname, form.suffix].filter(i => i).join(' ')
    })

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text)
        toast.success('In die Zwischenablage kopiert!')
    }



    // START: Roles
    function assignRole(roles: BasicRole|BasicRole[])
    {
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

    function removeRole(roles: BasicRole|BasicRole[])
    {
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
    // END: Roles



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
        await useAxios().postForm(apiRoute('/api/users/:id/:media', { id: id.value, media: mediaType.value }), {file})
        mediaInput.value.value = null
        fetch()
    }
    // END: Media



    // START: Server routes
    function fetch() {
        form.get(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store() {
        form.post(apiRoute('/api/users'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Nutzer wurde erstellt')
                navigateTo(apiRoute('/users/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update() {
        form.patch(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Nutzer wurde aktualisiert')
            },
        })
    }

    async function sendVerificationEmail() {
        await useAxios().post(apiRoute('/api/users/:id/send-verification-email', { id: id.value }))
        toast.success('E-Mail wurde verschickt')
        fetch()
    }

    async function verifyEmail(status: boolean) {
        form.email_verified_at = status
        await useAxios().patch(apiRoute('/api/users/:id/verify-email', { id: id.value }), { email_verified: status })
        fetch()
    }

    async function verifyPhone(status: boolean) {
        form.phone_verified_at = status
        await useAxios().patch(apiRoute('/api/users/:id/verify-phone', { id: id.value }), { phone_verified: status })
        fetch()
    }

    async function enableUser(status: boolean) {
        form.enabled_at = status
        await useAxios().patch(apiRoute('/api/users/:id/enable', { id: id.value }), { enabled: status })
        fetch()
    }

    async function requirePasswordChange(status: boolean) {
        form.requires_password_change = status
        await useAxios().patch(apiRoute('/api/users/:id/require-password-change', { id: id.value }), { requires_password_change: status })
        fetch()
    }

    async function requireTwoFactor(status: boolean) {
        form.requires_two_factor = status
        await useAxios().patch(apiRoute('/api/users/:id/require-two-factor', { id: id.value }), { requires_two_factor: status })
        fetch()
    }
    // END: Server routes



    // START: Change password
    const changePasswordPopup = ref()
    const changePasswordForm = useForm({
        password: '',
    })

    function changePassword() {
        changePasswordForm.patch(apiRoute('/api/users/:id/password', { id: id.value }), {
            onSuccess() {
                changePasswordPopup.value?.close()
                toast.success('Passwort geändert')
            },
        })
    }
    // END: Change password

    // START: Block user
    const blockUserPopup = ref()
    const blockUserForm = useForm({
        blocked: true,
        block_reason: '',
    })

    function blockUser() {
        blockUserForm.patch(apiRoute('/api/users/:id/block', { id: id.value }), {
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
    // END: Block user

    // START: Create token
    const createTokenPopup = ref()
    const createTokenForm = useForm({
        name: '',
        token: '',
    })

    function createToken() {
        createTokenForm.post(apiRoute('/api/users/:id/token', { id: id.value }), {
            onSuccess(data: any) {
                createTokenForm.reset()
                createTokenForm.token = data.token
                fetch()
                toast.success('Token erstellt')
            },
        })
    }

    function deleteToken(token: any) {
        useForm({}).delete(apiRoute('/api/users/:id/token/:token', { id: id.value, token: token.id }), {
            onSuccess() {
                fetch()
                toast.success('Token gelöscht')
            },
        })
    }
    // END: Create token

    
    
    // Fetch model
    if (id.value) fetch()
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
        gap: 2rem

    .entity-card
        display: flex
        flex-direction: column
        align-items: stretch
        overflow: hidden
        box-shadow: none !important

        .entity-card-head
            position: relative
            height: 10rem
            background: var(--color-background-soft)

        .iod-button
            position: absolute
            top: 1rem
            right: 1rem

        .iod-icon
            font-size: 4rem
</style>
