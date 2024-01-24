<template>
    <NuxtLayout limiter="text" name="auth-default" :pageTitle="id ? 'Nutzer bearbeiten' : 'Nutzer erstellen'" color="var(--color-primary)">
        <Card is="form" @submit.prevent="save">
            <Flex :padding="1" :gap="1">
                <IodInput label="Profilbild" v-model="form.profile_image"/>
                <IodInput label="Name" v-model="form.name"/>
                <IodInput label="Benutzername" v-model="form.username"/>
                <IodInput label="Identifikationsnummer" v-model="form.ident_number"/>
                <IodInput label="Email" v-model="form.email"/>
                <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password"/>
                <IodInput label="Anrede" v-model="form.salutation"/>
                <IodInput label="Präfix" v-model="form.prefix"/>
                <IodInput label="Vorname" v-model="form.firstname"/>
                <IodInput label="Zweiter Vorname" v-model="form.middlename"/>
                <IodInput label="Nachname" v-model="form.lastname"/>
                <IodInput label="Suffix" v-model="form.suffix"/>
                <IodInput label="Rechtsname" v-model="form.legalname"/>
                <IodInput label="Spitzname" v-model="form.nickname"/>
                <IodInput label="Firma" v-model="form.company"/>
                <IodInput label="Abteilung" v-model="form.department"/>
                <IodInput label="Titel" v-model="form.title"/>

                <IodButton type="submit" :loading="form.processing" label="Speichern" />
            </Flex>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })

    const id = computed(() => useRoute().params.id)

    const form = useForm({
        profile_image: '',
        name: '',
        username: '',
        ident_number: '',
        email: '',
        password: '',
        salutation: '',
        prefix: '',
        firstname: '',
        middlename: '',
        lastname: '',
        suffix: '',
        legalname: '',
        nickname: '',
        company: '',
        department: '',
        title: '',

    })

    if (id.value)
    {
        useForm({}).get(apiRoute('/api/users/:id', { id: id.value }), {
            onSuccess(data: any)
            {
                form.defaults(data.value).reset()
            },
        })
    }



    function save()
    {
        console.log(form.data())
    }
</script>

<style lang="sass" scoped></style>
