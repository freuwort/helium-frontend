<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Kontakt Editor" color="#FF4757">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-20 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/accounting/contacts"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex padding="1.5rem 1rem" :gap="3">
                <ErrorAlert :errors="form.errors" />

                <HeFlex :gap="1">
                    <IodSelect label="Typ" v-model="form.type" :options="typeOptions"/>
                    <IodInput label="Name" v-model="form.name"/>
                    <IodInput label="Kontakt Person" v-model="form.contact_person"/>
                </HeFlex>

                <HeFlex :gap="1">
                    <IodInput label="USt-IdNr." v-model="form.vat_id"/>
                    <IodInput label="Steuernummer" v-model="form.tax_id"/>
                </HeFlex>

                <HeFlex :gap="1" v-show="form.type !== 'self'">
                    <IodInput label="Kundennummer" v-model="form.customer_id" v-show="form.type === 'customer'"/>
                    <IodInput label="Lieferantennummer" v-model="form.supplier_id" v-show="form.type === 'supplier'"/>
                    <IodInput label="Mitarbeiternummer" v-model="form.employee_id" v-show="form.type === 'employee'"/>

                    <VDropdown>
                        <IodButton type="button" label="Hauptadresse auswählen" size="s" corner="pill" variant="contained"/>

                        <template #popper>
                            <IodAddressPicker v-model="form.main_address"/>
                        </template>
                    </VDropdown>
                </HeFlex>



                <!-- <HeFlex :gap="1">
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
                                <IodInput v-model="address.address_line_1" label="Straße" />
                                <IodInput v-model="address.postal_code" label="Postleitzahl" />
                                <IodInput v-model="address.city" label="Stadt" />
                                <IodSelect v-model="address.country_code" label="Land" :options="countries.map((e: Country) => ({text: e.name, value: e.code}))"/>
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert type="placeholder" class="h-40" text="Es wurden noch keine Adressen angelegt" v-else />
                </HeFlex> -->
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_users_show'

    

    // Item id
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        type: 'customer',
        name: '',
        vat_id: '',
        tax_id: '',
        customer_id: '',
        supplier_id: '',
        employee_id: '',
        contact_person: '',
        created_at: '',
        updated_at: '',
        main_address: null,
        billing_address: null,
        shipping_address: null,
    })



    // START: Types
    const typeOptions = [
        { text: 'Kunde', value: 'customer' },
        { text: 'Lieferant', value: 'supplier' },
        { text: 'Mitarbeiter', value: 'employee' },
        { text: 'Eigenkontakt', value: 'self' },
    ]
    // END: Types



    // START: Addresses
    function addAddress() {
        form.addresses.push({
            id: null,
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



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/accounting/contacts/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form.post(apiRoute('/api/accounting/contacts'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Kontakt wurde erstellt')
                navigateTo(apiRoute('/accounting/contacts/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        form.patch(apiRoute('/api/accounting/contacts/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Kontakt wurde aktualisiert')
            },
        })
    }
    // END: Server routes

    
    
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
