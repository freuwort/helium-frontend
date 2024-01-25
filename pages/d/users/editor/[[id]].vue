<template>
    <NuxtLayout name="auth-default" :pageTitle="id ? 'Nutzer bearbeiten' : 'Nutzer erstellen'" color="var(--color-primary)">
        <Card is="form" @submit.prevent="save">
            <Flex class="border-bottom" horizontal :padding="1">
                <IodButton type="button" label="Abbrechen" :loading="form.processing" variant="contained" @click="navigateTo('/d/users')"/>
                <Spacer />
                <IodButton type="submit" label="Speichern" :loading="form.processing" variant="filled" />
            </Flex>
            <Flex :padding="1" :gap="1">
                <ErrorAlert :errors="form.errors" />
                <IodInput label="Profilbild" v-model="form.model.profile_image"/>
                <IodInput label="Name" v-model="form.model.name"/>
                <IodInput label="Benutzername" v-model="form.model.username"/>
                <IodInput label="Identifikationsnummer" v-model="form.model.ident_number"/>
                <IodInput label="Email" v-model="form.model.email"/>
                <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password"/>
                <hr>
                <IodSelect label="Anrede" v-model="form.user_name.salutation" :options="salutation_options"/>
                <IodInput label="Präfix" v-model="form.user_name.prefix"/>
                <IodInput label="Vorname" v-model="form.user_name.firstname"/>
                <IodInput label="Zweiter Vorname" v-model="form.user_name.middlename"/>
                <IodInput label="Nachname" v-model="form.user_name.lastname"/>
                <IodInput label="Suffix" v-model="form.user_name.suffix"/>
                <IodInput label="Rechtsname" v-model="form.user_name.legalname"/>
                <IodInput label="Spitzname" v-model="form.user_name.nickname"/>
                <hr>
                <IodInput label="Firma" v-model="form.user_company.company"/>
                <IodInput label="Abteilung" v-model="form.user_company.department"/>
                <IodInput label="Titel" v-model="form.user_company.title"/>

                <hr>

                <Flex :gap=".5">
                    <Flex horizontal :gap=".5">
                        <b class="flex-1 padding-left-0-5 color-heading user-select-none">Adressen</b>
                        <IodButton type="button" class="margin-left-auto" label="Neue Adresse" size="small" variant="text" @click="addAddress()"/>
                    </Flex>
    
                    <div class="entity-grid">
                        <div class="flex vertical background-soft radius-m gap-0-5 padding-block-0-5" v-for="address, i in form.addresses">
                            <IodIcon icon="location_on" class="margin-inline-auto" style="font-size: 4rem; height: 8rem; width: 4rem; color: var(--color-text)" />
                            <hr class="margin-0">
                            <IodSelect style="width: 100% !important" v-model="address.type" label="Adress-Typ" :options="[
                                { value: 'main', text: 'Hauptadresse' },
                                { value: 'home', text: 'Zuhause' },
                                { value: 'work', text: 'Arbeit' },
                                { value: 'billing', text: 'Rechnungsadresse' },
                                { value: 'shipping', text: 'Lieferadresse' },
                                { value: 'other', text: 'Anders' },
                            ]"/>
                            <IodInput v-model="address.address_line_1" label="Straße" />
                            <IodInput v-model="address.postal_code" label="Postleitzahl" />
                            <IodInput v-model="address.city" label="Stadt" />
                            <IodInput v-model="address.country" label="Land" />
                            <hr class="margin-0">
                            <IodButton type="button" class="margin-inline-0-5" label="löschen" size="small" variant="text" color-preset="error" @click="removeAddress(i)"/>
                        </div>
                    </div>
                </Flex>
            </Flex>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    definePageMeta({
        middleware: 'auth',
    })

    // Item id
    const id = computed(() => useRoute().params.id)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value ?? null,
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
    })

    const salutation_options = [
        { value: 'Herr', text: 'Herr' },
        { value: 'Frau', text: 'Frau' },
        { value: 'Divers', text: 'Divers' },
    ]



    // START: Addresses
    function addAddress()
    {
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

    function removeAddress(index: number)
    {
        form.addresses.splice(index, 1)
    }
    // END: Addresses



    function fetch()
    {
        form.get(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(data: any)
            {
                form.defaults(data.value).reset()
            },
        })
    }

    function store()
    {
        form.post(apiRoute('/api/users'), {
            onSuccess(data: any)
            {
                form.defaults(data.value).reset()
                toast.success('Nutzer wurde erstellt')
                navigateTo(apiRoute('/d/users/editor/:id', { id: data.value.id }))
            },
        })
    }

    function update()
    {
        form.patch(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(data: any)
            {
                form.defaults(data.value).reset()
                toast.success('Nutzer wurde aktualisiert')
            },
        })
    }

    // Initial fetch
    if (id.value) fetch()
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))
        grid-gap: 1rem
</style>
