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
            </Flex>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    definePageMeta({
        middleware: 'auth',
    })

    const id = computed(() => useRoute().params.id)

    const form = useForm({
        id: useRoute().params.id ?? null,
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
    })

    const salutation_options = [
        { value: 'Herr', text: 'Herr' },
        { value: 'Frau', text: 'Frau' },
        { value: 'Divers', text: 'Divers' },
    ]

    if (id.value)
    {
        useForm({}).get(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(data: any)
            {
                form.defaults(data.value).reset()
            },
        })
    }



    const save = id.value ? update : store

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
</script>

<style lang="sass" scoped></style>
