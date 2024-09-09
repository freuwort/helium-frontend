<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Unternehmens Editor">
        <HeCard is="form" @submit.prevent="save">
            <ProfileCard
                v-show="!!form.id"
                allow-avatar-upload
                avatar-tooltip="Logo hochladen"
                allow-banner-upload
                banner-tooltip="Banner hochladen"
                class="rounded-t-2xl border-b"
                :title="form.model.name"
                :banner="form.model.banner"
                :avatar="form.model.logo"
                :subtitle="form.model.description"
                @upload:avatar="selectMedia('logo')"
                @upload:banner="selectMedia('banner')"
            />

            <input class="hidden" ref="mediaInput" type="file" @change="uploadMedia(($event.target as any).files[0])" />
            
            <div class="flex items-center p-4 border-y sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/companies"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Unternehmen</h5>
                    <IodInput label="Name" v-model="form.model.name"/>
                    <IodSelect v-model="form.model.legal_form" label="Rechtsform" :options="legal_forms"/>
                    <IodInput label="Slogan" v-model="form.model.description"/>
                    <IodInput label="Notiz" v-model="form.model.notes"/>
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
                        <h5 class="m-0 font-medium">Rechtliche Details</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neues Detail" size="s" variant="contained" @click="addLegalDetail()"/>
                    </HeFlex>

                    <div class="entity-grid" v-if="form.legal_details?.length">
                        <HeCard class="entity-card" v-for="detail, i in form.legal_details">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="gavel" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeLegalDetail(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodSelect v-model="detail.type" label="Rechtsinfo" :options="legal_details_types"/>
                                <IodInput v-model="detail.value" label="Eingabe" />
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert as="placeholder" class="h-40" v-else>
                        <span>Es wurden noch keine rechtlichen Details angelegt</span>
                    </IodAlert>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Adressen</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neue Adresse" size="s" variant="contained" @click="addAddress()"/>
                    </HeFlex>
    
                    <div class="entity-grid" v-if="form.addresses?.length">
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

                    <div class="entity-grid" v-if="form.bank_connections?.length">
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

                    <div class="entity-grid" v-if="form.emails?.length">
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

                    <div class="entity-grid" v-if="form.phonenumbers?.length">
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

                    <div class="entity-grid" v-if="form.dates?.length">
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

                    <div class="entity-grid" v-if="form.links?.length">
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
    import { toast } from 'vue3-toastify'
    import type { Country } from '~/types/units'

    definePageMeta({
        middleware: 'auth',
    })

    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_companies_show'

    

    // Item id
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            logo: '',
            banner: '',
            name: '',
            legal_form: '',
            description: '',
            notes: '',
            deleted_at: '',
            created_at: '',
            updated_at: '',
        },
        legal_details: [],
        identifiers: [],
        addresses: [],
        bank_connections: [],
        emails: [],
        phonenumbers: [],
        dates: [],
        links: [],
    })

    const countries = ref([])

    const legal_forms = [
        { value: 'gmbh', text: 'GmbH' },
        { value: 'gbr', text: 'GbR' },
        { value: 'ohg', text: 'OHG' },
        { value: 'kg', text: 'KG' },
        { value: 'ug', text: 'UG' },
        { value: 'ag', text: 'AG' },
        { value: 'eg', text: 'eG' },
        { value: 'ev', text: 'e.V.' },
        { value: 'sole-proprietor', text: 'Einzelunternehmen' },
        { value: 'freelancer', text: 'Freiberufler' },
        { value: 'other', text: 'Anders' },
    ]

    const identifier_types = [
        { value: 'customer_id', text: 'Kundennummer' },
        { value: 'company_id', text: 'Firmennummer' },
        { value: 'debtor_id', text: 'Debitorennummer' },
        { value: 'creditor_id', text: 'Kreditorennummer' },
        { value: 'other', text: 'Anders' },
    ]

    const legal_details_types = [
        { value: 'vat_id', text: 'Umsatzsteuer ID' },
        { value: 'tax_id', text: 'Steuernummer' },
        { value: 'trade_id', text: 'Handelsregister ID' },
        { value: 'board', text: 'Vorstand' },
        { value: 'supervisory_board', text: 'Aufsichtsrat' },
        { value: 'register_court', text: 'Registergericht' },
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



    // START: Legal details
    function addLegalDetail() {
        form.legal_details.push({
            id: null,
            type: 'vat_id',
            value: '',
        })
    }

    function removeLegalDetail(index: number) {
        form.legal_details.splice(index, 1)
    }
    // END: Legal details



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
    type MediaType = 'logo'|'banner'
    const mediaInput = ref()
    const mediaType = ref<MediaType>('logo')

    function selectMedia(type: MediaType){
        mediaType.value = type
        mediaInput.value.click()
    }

    async function uploadMedia(file: any) {
        if (!file) return
        await useAxios().postForm(apiRoute('/api/companies/:id/:media', { id: id.value, media: mediaType.value }), {file})
        mediaInput.value.value = null
        fetch()
    }
    // END: Media



    // START: Server routes
    function fetch()
    {
        
        form.get(apiRoute('/api/companies/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form.post(apiRoute('/api/companies'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Unternehmen wurde erstellt')
                navigateTo(apiRoute('/companies/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        form.patch(apiRoute('/api/companies/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Unternehmen wurde aktualisiert')
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
