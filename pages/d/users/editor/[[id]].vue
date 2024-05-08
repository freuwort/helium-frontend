<template>
    <NuxtLayout name="auth-default" :pageTitle="id ? 'Nutzer bearbeiten' : 'Nutzer erstellen'" color="var(--color-primary)">
        <Card is="form" @submit.prevent="save">
            <ProfileCard class="radius-xl" :title="fullname" :image="form.model.profile_image" :subtitle="form.model.username"/>
            
            <HeFlex class="border-y" horizontal padding="1rem 2rem">
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
                    <IodInput label="Identifikationsnummer" v-model="form.model.ident_number"/>
                    <IodInput label="Email" v-model="form.model.email"/>
                    <IodInput type="password" label="Passwort" autocomplete="new-password" show-score :score-function="useZxcvbn()" v-model="form.password"/>
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
                    <Flex horizontal>
                        <h5 class="m-0 font-medium">Adressen</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Adresse" size="s" variant="contained" @click="addAddress()"/>
                    </Flex>
    
                    <div class="entity-grid" v-if="form.addresses.length">
                        <Card class="entity-card" v-for="address, i in form.addresses">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="location_on" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeAddress(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="address.type" label="Adress-Typ" :options="address_types"/>
                                <IodInput v-model="address.address_line_1" label="Straße" />
                                <IodInput v-model="address.postal_code" label="Postleitzahl" />
                                <IodInput v-model="address.city" label="Stadt" />
                                <IodInput v-model="address.country" label="Land" />
                            </HeFlex>
                        </Card>
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
                        <Card class="entity-card" v-for="bank, i in form.bank_connections">
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
                        </Card>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine Bankverbindungen angelegt</span>
                    </IodAlert>
                </HeFlex>



                <Flex :gap="1">
                    <Flex horizontal>
                        <h5 class="m-0 font-medium">Emails</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Email" size="s" variant="contained" @click="addEmail()"/>
                    </Flex>

                    <div class="entity-grid" v-if="form.emails.length">
                        <Card class="entity-card" v-for="email, i in form.emails">
                            <Flex class="entity-card-head" padding="1rem">
                                <IodIcon icon="email" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeEmail(i)"/>
                            </Flex>
                            <Flex padding="1rem" gap="1rem">
                                <IodSelect v-model="email.type" label="Email-Typ" :options="email_types"/>
                                <IodInput v-model="email.email" label="Email" />
                            </Flex>
                        </Card>
                    </div>

                    <IodAlert as="placeholder" class="h-10" v-else>
                        <span>Es wurden noch keine Emails angelegt</span>
                    </IodAlert>
                </Flex>



                <Flex :gap="1">
                    <Flex horizontal>
                        <h5 class="m-0 font-medium">Telefonnummern</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Telefonnummer" size="s" variant="contained" @click="addPhonenumber()"/>
                    </Flex>

                    <div class="entity-grid" v-if="form.phonenumbers.length">
                        <Card class="entity-card" v-for="number, i in form.phonenumbers">
                            <Flex class="entity-card-head" padding="1rem">
                                <IodIcon icon="phone" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removePhonenumber(i)"/>
                            </Flex>
                            <Flex padding="1rem" gap="1rem">
                                <IodSelect v-model="number.type" label="Nummer-Typ" :options="phonenumbers_types"/>
                                <IodInput v-model="number.number" label="Nummer" />
                            </Flex>
                        </Card>
                    </div>

                    <IodAlert as="placeholder" class="h-10" v-else>
                        <span>Es wurden noch keine Telefonnummern angelegt</span>
                    </IodAlert>
                </Flex>



                <Flex :gap="1">
                    <Flex horizontal>
                        <h5 class="m-0 font-medium">Termine & Daten</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neuer Termin" size="s" variant="contained" @click="addDate()"/>
                    </Flex>

                    <div class="entity-grid" v-if="form.dates.length">
                        <Card class="entity-card" v-for="date, i in form.dates">
                            <Flex class="entity-card-head" padding="1rem">
                                <IodIcon icon="event" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeDate(i)"/>
                            </Flex>
                            <Flex padding="1rem" gap="1rem">
                                <IodSelect v-model="date.type" label="Datum-Typ" :options="date_types"/>
                                <IodInput v-model="date.date" label="Datum" type="date" />
                                <IodToggle v-model="date.ignore_year" label="Jahr ignorieren" />
                                <IodToggle v-model="date.repeats_annually" label="Jährlich wiederholen" />
                            </Flex>
                        </Card>
                    </div>

                    <IodAlert as="placeholder" class="h-10" v-else>
                        <span>Es wurden noch keine Termine angelegt</span>
                    </IodAlert>
                </Flex>



                <Flex :gap="1">
                    <Flex horizontal>
                        <h5 class="m-0 font-medium">Links</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neuer Link" size="s" variant="contained" @click="addLink()"/>
                    </Flex>

                    <div class="entity-grid" v-if="form.links.length">
                        <Card class="entity-card" v-for="link, i in form.links">
                            <Flex class="entity-card-head" padding="1rem">
                                <IodIcon icon="link" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeLink(i)"/>
                            </Flex>
                            <Flex padding="1rem" gap="1rem">
                                <IodInput v-model="link.name" label="Label" />
                                <IodInput v-model="link.url" label="URL" />
                            </Flex>
                        </Card>
                    </div>

                    <IodAlert as="placeholder" class="h-10" v-else>
                        <span>Es wurden noch keine Links angelegt</span>
                    </IodAlert>
                </Flex>
            </HeFlex>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

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
            ident_number: '',
            email: '',
            email_verified_at: '',
            enabled_at: '',
            deleted_at: '',
            created_at: '',
            updated_at: '',
        },
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

    const salutation_options = [
        { value: 'Herr', text: 'Herr' },
        { value: 'Frau', text: 'Frau' },
        { value: 'Divers', text: 'Divers' },
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
            country: '',
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
        form.post(apiRoute('/api/users'), {
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
        form.patch(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.value?.data).reset()
                toast.success('Nutzer wurde aktualisiert')
            },
        })
    }
    // END: Server routes

    // Initial fetch
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
        box-shadow: none

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
