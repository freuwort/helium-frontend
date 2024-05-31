<template>
    <NuxtLayout limiter="medium" name="auth-default" :pageTitle="id ? 'Nutzer bearbeiten' : 'Nutzer erstellen'" color="var(--color-primary)">
        <HeCard is="form" @submit.prevent="save">
            <ProfileCard class="rounded-2xl" :title="fullname" :image="form.model.profile_image" :subtitle="form.model.username"/>
            
            <HeFlex class="border-y sticky top-16 z-20 bg-background" horizontal padding="1rem 2rem">
                <IodButton type="button" label="Zur Übersicht" :loading="form.processing" variant="contained" @click="navigateTo('/d/users')"/>
                <HeSpacer />
                <IodButton type="submit" label="Speichern" :loading="form.processing" variant="filled" />
            </HeFlex>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Konto</h5>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodInput label="Benutzername" v-model="form.model.username"/>
                    <IodInput label="Email" v-model="form.model.email"/>
                    <IodInput type="password" label="Passwort" autocomplete="new-password" show-score :score-function="useZxcvbn()" v-model="form.password"/>
                </HeFlex>

                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Berechtigungen</h5>
                    <VDropdown :shown="!!searchForm.search.length && !!searchForm.results.length" :triggers="[]" :auto-hide="false">
                        <IodInput type="search" placeholder="Rollen suchen" v-model="searchForm.search" @update:modelValue="throttledSearch()" />

                        <template #popper>
                            <HeFlex align-y="flex-start" padding="1rem 0" class="min-w-80 max-h-80 small-scrollbar">
                                <ProfileChip class="h-12 !p-2 flex-none" corner="none" v-for="result in searchForm.results" :title="result.name" :icon="result.icon" :color="result.color" @click="addRole(result)"/>
                            </HeFlex>
                        </template>
                    </VDropdown>
                    <div class="flex gap-2 flex-wrap">
                        <IodButton
                            v-for="role in form.roles"
                            border
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
                        <IodButton type="button" label="Neue Ident. Nr." size="s" variant="contained" @click="addIdentifier()"/>
                    </HeFlex>
    
                    <div class="entity-grid" v-if="form.identifiers.length">
                        <HeCard class="entity-card" v-for="identifier, i in form.identifiers">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="badge" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeIdentifier(i)"/>
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
                        <IodButton type="button" label="Neue Adresse" size="s" variant="contained" @click="addAddress()"/>
                    </HeFlex>
    
                    <div class="entity-grid" v-if="form.addresses.length">
                        <HeCard class="entity-card" v-for="address, i in form.addresses">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="location_on" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeAddress(i)"/>
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
                        <IodButton type="button" label="Neue Bankverbindung" size="s" variant="contained" @click="addBankConnection()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.bank_connections.length">
                        <HeCard class="entity-card" v-for="bank, i in form.bank_connections">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="account_balance" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeBankConnection(i)"/>
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
                        <IodButton type="button" label="Neue Email" size="s" variant="contained" @click="addEmail()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.emails.length">
                        <HeCard class="entity-card" v-for="email, i in form.emails">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="email" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeEmail(i)"/>
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
                        <IodButton type="button" label="Neue Telefonnummer" size="s" variant="contained" @click="addPhonenumber()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.phonenumbers.length">
                        <HeCard class="entity-card" v-for="number, i in form.phonenumbers">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="phone" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removePhonenumber(i)"/>
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
                        <IodButton type="button" label="Neuer Termin" size="s" variant="contained" @click="addDate()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.dates.length">
                        <HeCard class="entity-card" v-for="date, i in form.dates">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="event" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeDate(i)"/>
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
                        <IodButton type="button" label="Neuer Link" size="s" variant="contained" @click="addLink()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.links.length">
                        <HeCard class="entity-card" v-for="link, i in form.links">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="link" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeLink(i)"/>
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
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { debounce, throttle } from 'lodash'
    import { toast } from 'vue3-toastify'
    import type { Country } from '~/types/units'

    definePageMeta({
        middleware: 'auth',
    })

    

    // Item id
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        password: '',
        model: {
            profile_image: '',
            name: '',
            username: '',
            email: '',
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
                exclude: form.roles.map((e: any) => e.id)
            },
            size: 10,
        }))).data.data
    }

    function addRole(role: any) {
        form.roles.push(role)
        searchForm.reset()
    }

    function removeRole(role: any) {
        form.roles = form.roles.filter((e: any) => e.id !== role.id)
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



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
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
                form.defaults(response.value?.data).reset()
                toast.success('Nutzer wurde erstellt')
                navigateTo(apiRoute('/d/users/editor/:id', { id: response.value?.data?.id }))
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
                form.defaults(response.value?.data).reset()
                toast.success('Nutzer wurde aktualisiert')
            },
        })
    }
    // END: Server routes

    
    
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
