<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Nutzer Editor">
        <HeCard is="form" @submit.prevent="save">
            <ProfileCard
                v-show="!!form.id"
                allow-avatar-upload
                allow-banner-upload
                class="rounded-t-2xl border-b"
                :title="fullname"
                :avatar="form.model.avatar"
                :banner="form.model.banner"
                :subtitle="form.model.username"
                @upload:avatar="selectMedia('avatar')"
                @upload:banner="selectMedia('banner')"
            />

            
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/users"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex padding="1.5rem 1rem" :gap="3">
                <ErrorAlert :errors="form.errors" />


                <input class="hidden" ref="mediaInput" type="file" @change="uploadMedia(($event.target as any).files[0])" />

                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Konto</h5>
                        <HeSpacer />
                        <VDropdown placement="bottom-end">
                            <IodButton type="button" label="Aktionen" icon-right="expand_more" size="s" corner="pill" variant="contained"/>
                            <template #popper>
                                <ContextMenu class="min-w-96">
                                    <ContextMenuLabel label="Freigaben"/>
                                    <ContextMenuItem is="button" type="button" icon="mark_email_read" label="Email bestätigen" @click="verifyEmail(!form.model.email_verified_at)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.model.email_verified_at"/>
                                        </template>
                                    </ContextMenuItem>
                                    <ContextMenuItem is="button" type="button" icon="how_to_reg" label="Nutzer freigeben" @click="enableUser(!form.model.enabled_at)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.model.enabled_at"/>
                                        </template>
                                    </ContextMenuItem>

                                    <ContextMenuDivider />
                                    <ContextMenuLabel label="Sicherheit"/>
                                    <ContextMenuItem is="button" type="button" icon="lock" label="Passwort ändern" @click="changePasswordPopup.open()" v-close-popper/>
                                    <ContextMenuItem is="button" type="button" icon="lock_reset" label="Passwort-Änderung anfordern" @click="requirePasswordChange(!form.model.requires_password_change)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.model.requires_password_change"/>
                                        </template>
                                    </ContextMenuItem>
                                    <ContextMenuItem is="button" type="button" icon="shield_lock" label="2FA-Einrichtung anfordern" @click="requireTwoFactor(!form.model.requires_two_factor)">
                                        <template #right>
                                            <IodToggle type="switch" class="!p-0 !pr-4" style="--local-color-on: var(--color-success)" :modelValue="!!form.model.requires_two_factor"/>
                                        </template>
                                    </ContextMenuItem>

                                    <!-- <ContextMenuDivider />
                                    <ContextMenuItem is="button" type="button" icon="do_not_disturb_on" color="var(--color-error)" label="Nutzer sperren" v-close-popper/> -->
                                </ContextMenu>
                            </template>
                        </VDropdown>
                    </HeFlex>
                    <IodInput label="Benutzername" v-model="form.model.username"/>
                    <IodInput label="Email" v-model="form.model.email"/>
                </HeFlex>

                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Berechtigungen</h5>
                    <VDropdown :shown="!!searchForm.search.length && !!searchForm.results.length" :triggers="[]" :auto-hide="false">
                        <IodInput type="search" placeholder="Rollen suchen" v-model="searchForm.search" @update:modelValue="throttledSearch()" />

                        <template #popper>
                            <HeFlex align-y="flex-start" padding="1rem 0" class="min-w-80 max-h-80 small-scrollbar">
                                <ProfileChip class="h-12 !p-2 flex-none" corner="none" v-for="result in searchForm.results" :title="result.name" :icon="result.icon" :color="result.color" @click="assignRole(result)"/>
                            </HeFlex>
                        </template>
                    </VDropdown>
                    <div class="flex gap-2 flex-wrap">
                        <IodButton
                            v-for="role in form.roles"
                            size="s"
                            corner="pill"
                            type="button"
                            variant="contained"
                            v-tooltip='`"${role.name}" Rolle entfernen`'
                            :background="role.color"
                            :icon-left="role.icon"
                            :label="role.name"
                            @click="removeRole(role)"
                        />
                    </div>
                </HeFlex>




                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Name</h5>
                    <IodSelect label="Anrede" v-model="form.user_name.salutation" :options="salutation_options"/>
                    <IodInput label="Präfix" v-model="form.user_name.prefix"/>
                    <IodInput label="Vorname" v-model="form.user_name.firstname"/>
                    <IodInput label="Zweiter Vorname" v-model="form.user_name.middlename"/>
                    <IodInput label="Nachname" v-model="form.user_name.lastname"/>
                    <IodInput label="Suffix" v-model="form.user_name.suffix"/>
                    <IodInput label="Rechtsname" v-model="form.user_name.legalname"/>
                    <IodInput label="Spitzname" v-model="form.user_name.nickname"/>
                </HeFlex>



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Arbeit</h5>
                    <IodInput label="Firma" v-model="form.user_company.company"/>
                    <IodInput label="Abteilung" v-model="form.user_company.department"/>
                    <IodInput label="Titel" v-model="form.user_company.title"/>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Identifikationsnummern</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Ident. Nr." size="s" corner="pill" variant="contained" @click="addIdentifier()"/>
                    </HeFlex>
    
                    <div class="entity-grid" v-if="form.identifiers.length">
                        <HeCard class="entity-card" v-for="identifier, i in form.identifiers">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="badge" />
                                <IodButton type="button" label="Löschen" size="s" corner="pill" variant="contained" color-preset="error" @click="removeIdentifier(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="identifier.type" label="Ident. Nr. Typ" :options="identifier_types"/>
                                <IodInput v-model="identifier.label" label="Label" />
                                <IodInput v-model="identifier.value" label="Identifikationsnummer" />
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Identifikationsnummern angelegt</span>
                    </IodAlert>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Adressen</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Adresse" size="s" corner="pill" variant="contained" @click="addAddress()"/>
                    </HeFlex>
    
                    <div class="entity-grid" v-if="form.addresses.length">
                        <HeCard class="entity-card" v-for="address, i in form.addresses">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="location_on" />
                                <IodButton type="button" label="Löschen" size="s" corner="pill" variant="contained" color-preset="error" @click="removeAddress(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="address.type" label="Adress-Typ" :options="address_types"/>
                                <IodInput v-model="address.address_line_1" label="Straße" />
                                <IodInput v-model="address.postal_code" label="Postleitzahl" />
                                <IodInput v-model="address.city" label="Stadt" />
                                <IodSelect v-model="address.country_code" label="Land" :options="countries.map((e: Country) => ({text: e.name, value: e.code}))"/>
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Adressen angelegt</span>
                    </IodAlert>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Bankverbindungen</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Bankverbindung" size="s" corner="pill" variant="contained" @click="addBankConnection()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.bank_connections.length">
                        <HeCard class="entity-card" v-for="bank, i in form.bank_connections">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="account_balance" />
                                <IodButton type="button" label="Löschen" size="s" corner="pill" variant="contained" color-preset="error" @click="removeBankConnection(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="bank.type" label="Verbindungs-Typ" :options="bank_connection_types"/>
                                <IodInput v-model="bank.bank_name" label="Bankname" />
                                <IodInput v-model="bank.branch" label="Filiale" />
                                <IodInput v-model="bank.account_name" label="Kontoinhaber" />
                                <IodInput v-model="bank.account_number" label="Kontonummer" />
                                <IodInput v-model="bank.iban" label="IBAN" />
                                <IodInput v-model="bank.swift_code" label="SWIFT / BIC" />
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Bankverbindungen angelegt</span>
                    </IodAlert>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Emails</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Email" size="s" corner="pill" variant="contained" @click="addEmail()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.emails.length">
                        <HeCard class="entity-card" v-for="email, i in form.emails">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="email" />
                                <IodButton type="button" label="Löschen" size="s" corner="pill" variant="contained" color-preset="error" @click="removeEmail(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="email.type" label="Email-Typ" :options="email_types"/>
                                <IodInput v-model="email.email" label="Email" />
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Emails angelegt</span>
                    </IodAlert>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Telefonnummern</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Telefonnummer" size="s" corner="pill" variant="contained" @click="addPhonenumber()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.phonenumbers.length">
                        <HeCard class="entity-card" v-for="number, i in form.phonenumbers">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="phone" />
                                <IodButton type="button" label="Löschen" size="s" corner="pill" variant="contained" color-preset="error" @click="removePhonenumber(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="number.type" label="Nummer-Typ" :options="phonenumbers_types"/>
                                <IodInput v-model="number.number" label="Nummer" />
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Telefonnummern angelegt</span>
                    </IodAlert>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Termine & Daten</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neuer Termin" size="s" corner="pill" variant="contained" @click="addDate()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.dates.length">
                        <HeCard class="entity-card" v-for="date, i in form.dates">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="event" />
                                <IodButton type="button" label="Löschen" size="s" corner="pill" variant="contained" color-preset="error" @click="removeDate(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="date.type" label="Datum-Typ" :options="date_types"/>
                                <IodInput v-model="date.date" label="Datum" type="date" />
                                <IodToggle v-model="date.ignore_year" label="Jahr ignorieren" />
                                <IodToggle v-model="date.repeats_annually" label="Jährlich wiederholen" />
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Termine angelegt</span>
                    </IodAlert>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Links</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neuer Link" size="s" corner="pill" variant="contained" @click="addLink()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.links.length">
                        <HeCard class="entity-card" v-for="link, i in form.links">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="link" />
                                <IodButton type="button" label="Löschen" size="s" corner="pill" variant="contained" color-preset="error" @click="removeLink(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodInput v-model="link.name" label="Label" />
                                <IodInput v-model="link.url" label="URL" />
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Links angelegt</span>
                    </IodAlert>
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
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { throttle } from 'lodash'
    import { toast } from 'vue3-toastify'
    import type { Country } from '~/types/units'
    import type { BasicRole } from '~/types/role'

    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_users_show'

    

    // Item id
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            avatar: null,
            banner: null,
            name: '',
            username: '',
            email: '',
            requires_password_change: false,
            requires_two_factor: false,
            email_verified_at: '',
            enabled_at: '',
            deleted_at: '',
            created_at: '',
            updated_at: '',
        },
        roles: [],
        user_name: {
            salutation: '',
            prefix: '',
            firstname: '',
            middlename: '',
            lastname: '',
            suffix: '',
            legalname: '',
            nickname: '',
        },
        user_company: {
            company: '',
            department: '',
            title: '',
        },
        identifiers: [],
        addresses: [],
        bank_connections: [],
        emails: [],
        phonenumbers: [],
        dates: [],
        links: [],
    })

    const fullname = computed(() => {
        const name = form.user_name
        return [name.prefix, name.firstname, name.middlename, name.lastname, name.suffix].filter(Boolean).join(' ')
    })
    
    const countries = ref([])

    const salutation_options = [
        { value: 'Herr', text: 'Herr' },
        { value: 'Frau', text: 'Frau' },
        { value: 'Divers', text: 'Divers' },
    ]

    const identifier_types = [
        { value: 'customer_id', text: 'Kunden Nr.' },
        { value: 'employee_id', text: 'Personal Nr.' },
        { value: 'member_id', text: 'Mitglieds Nr.' },
        { value: 'debtor_id', text: 'Debitoren Nr.' },
        { value: 'creditor_id', text: 'Kreditoren Nr.' },
        { value: 'other', text: 'Anders' },
    ]

    const address_types = [
        { value: 'main', text: 'Hauptadresse' },
        { value: 'home', text: 'Zuhause' },
        { value: 'work', text: 'Arbeit' },
        { value: 'billing', text: 'Rechnungsadresse' },
        { value: 'shipping', text: 'Lieferadresse' },
        { value: 'other', text: 'Anders' },
    ]

    const bank_connection_types = [
        { value: 'checking', text: 'Girokonto' },
        { value: 'savings', text: 'Sparbuch' },
        { value: 'business', text: 'Geschäftskonto' },
        { value: 'loan', text: 'Kreditkonto' },
        { value: 'investment', text: 'Investmentkonto' },
        { value: 'other', text: 'Anders' },
    ]

    const email_types = [
        { value: 'main', text: 'Hauptemail' },
        { value: 'home', text: 'Zuhause' },
        { value: 'work', text: 'Arbeit' },
        { value: 'other', text: 'Anders' },
    ]
    
    const phonenumbers_types = [
        { value: 'main', text: 'Hauptnummer' },
        { value: 'home', text: 'Zuhause' },
        { value: 'work', text: 'Arbeit' },
        { value: 'mobile', text: 'Mobil' },
        { value: 'fax', text: 'Fax' },
        { value: 'other', text: 'Anders' },
    ]

    const date_types = [
        { value: 'birthday', text: 'Geburtstag' },
        { value: 'anniversary', text: 'Jahrestag' },
        { value: 'other', text: 'Anders' },
    ]



    // START: Roles
    const searchForm = useForm({
        search: '',
        results: [],
    })

    const throttledSearch = throttle(search, 400)

    async function search() {
        searchForm.results = (await useAxios().get(apiRoute('/api/roles/basic', {
            filter: {
                search: searchForm.search,
                exclude: form.roles.map((item: BasicRole) => item.id)
            },
            size: 10,
        }))).data.data
    }

    function assignRole(roles: BasicRole|BasicRole[])
    {
        if (!Array.isArray(roles)) roles = [roles]

        form.roles.push(...roles)
        searchForm.reset()

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



    // START: Identifiers
    function addIdentifier() {
        form.identifiers.push({
            id: null,
            type: 'customer_id',
            label: '',
            value: '',
        })
    }

    function removeIdentifier(index: number) {
        form.identifiers.splice(index, 1)
    }
    // END: Identifiers



    // START: Addresses
    function addAddress() {
        form.addresses.push({
            id: null,
            type: 'main',
            address_line_1: '',
            address_line_2: '',
            postal_code: '',
            city: '',
            state: '',
            country_code: '',
            notes: '',
        })
    }

    function removeAddress(index: number) {
        form.addresses.splice(index, 1)
    }
    // END: Addresses



    // START: Bank connections
    function addBankConnection() {
        form.bank_connections.push({
            id: null,
            type: 'checking',
            bank_name: '',
            branch: '',
            account_name: '',
            account_number: '',
            swift_code: '',
            iban: '',
        })
    }

    function removeBankConnection(index: number) {
        form.bank_connections.splice(index, 1)
    }
    // END: Bank connections



    // START: Emails
    function addEmail() {
        form.emails.push({
            id: null,
            type: 'main',
            email: '',
            verified_at: null,
        })
    }

    function removeEmail(index: number) {
        form.emails.splice(index, 1)
    }
    // END: Emails



    // START: Phonenumbers
    function addPhonenumber() {
        form.phonenumbers.push({
            id: null,
            type: 'main',
            number: '',
            verified_at: null,
        })
    }

    function removePhonenumber(index: number) {
        form.phonenumbers.splice(index, 1)
    }
    // END: Phonenumbers



    // START: Dates
    function addDate() {
        form.dates.push({
            id: null,
            type: 'birthday',
            date: null,
            ignore_year: false,
            repeats_annually: true,
        })
    }

    function removeDate(index: number) {
        form.dates.splice(index, 1)
    }
    // END: Dates



    // START: Links
    function addLink() {
        form.links.push({
            id: null,
            name: 'Website',
            url: '',
        })
    }

    function removeLink(index: number) {
        form.links.splice(index, 1)
    }
    // END: Links



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
    function fetch()
    {
        form.get(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form
        .transform(data => {
            return { ...data, roles: data.roles.map((e: any) => e.id)
            }
        })
        .post(apiRoute('/api/users'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Nutzer wurde erstellt')
                navigateTo(apiRoute('/users/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .transform(data => {
            return { ...data, roles: data.roles.map((e: any) => e.id)
            }
        })
        .patch(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Nutzer wurde aktualisiert')
            },
        })
    }

    async function verifyEmail(status: boolean)
    {
        form.model.email_verified_at = status
        await useAxios().patch(apiRoute('/api/users/:id/verify-email', { id: id.value }), { email_verified: status })
        fetch()
    }

    async function enableUser(status: boolean)
    {
        form.model.enabled_at = status
        await useAxios().patch(apiRoute('/api/users/:id/enable', { id: id.value }), { enabled: status })
        fetch()
    }

    async function requirePasswordChange(status: boolean)
    {
        form.model.requires_password_change = status
        await useAxios().patch(apiRoute('/api/users/:id/require-password-change', { id: id.value }), { requires_password_change: status })
        fetch()
    }

    async function requireTwoFactor(status: boolean)
    {
        form.model.requires_two_factor = status
        await useAxios().patch(apiRoute('/api/users/:id/require-two-factor', { id: id.value }), { requires_two_factor: status })
        fetch()
    }
    // END: Server routes



    // START: Change password
    const changePasswordPopup = ref()
    const changePasswordForm = useForm({
        password: '',
    })

    function changePassword()
    {
        changePasswordForm.patch(apiRoute('/api/users/:id/password', { id: id.value }), {
            onSuccess() {
                changePasswordPopup.value?.close()
                toast.success('Passwort geändert')
            },
        })
    }
    // END: Change password

    
    
    // Fetch model
    if (id.value) fetch()
    
    onMounted(async () => {
        // Fetch additional data
        countries.value = (await useAxios().get('/api/domain/units')).data.countries
    })
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
