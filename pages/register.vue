<template>
    <NuxtLayout name="guest-default" pageTitle="Registrieren">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="handleRegister">
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Registrieren</h1>

                    <div class="flex flex-col flex-wrap gap-2 sm:items-center sm:flex-row">
                        <IodButton class="flex-1" type="button" v-for="profile in profiles.customProfiles.value" :label="profile.name" corner="pill" @click="profiles.toggle(profile)"/>
                    </div>

                    <div class="flex flex-col gap-4">
                        <pre>Ausgewählt:<br>{{ profiles.selectedProfiles.value.map(e => e.name).join(' ▮ ') }}</pre>
                        <pre>Noch auswählbar:<br>{{ profiles.selectableProfiles.value.map(e => e.name).join(' ▮ ') }}</pre>
                        <pre>Valide: {{ profiles.isValidSelection.value ? 'Ja' : 'Nein' }}</pre>
                        <!-- <pre>Verfügbar:<br>{{ profiles.customProfiles.value.map(e => e.name).join(' ▮ ') }}</pre> -->
                    </div>
    
                    <div class="flex flex-col gap-4">
                        <IodInput type="email" label="Email" v-model="form.email" v-show="profiles.showField('email')"/>
                        <IodInput type="text" label="Telefon" v-model="form.phone" v-show="profiles.showField('phone')"/>
                        <IodInput type="text" label="Nutzername" v-model="form.username" v-show="profiles.showField('username')"/>
                        <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password" v-show="profiles.showField('password')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Anrede" v-model="form.salutation" v-show="profiles.showField('salutation')"/>
                        <IodInput type="text" label="Titel" v-model="form.prefix" v-show="profiles.showField('prefix')"/>
                        <IodInput type="text" label="Vorname" v-model="form.firstname" v-show="profiles.showField('firstname')"/>
                        <IodInput type="text" label="Zweiter Vorname" v-model="form.firstname" v-show="profiles.showField('middlename')"/>
                        <IodInput type="text" label="Nachname" v-model="form.lastname" v-show="profiles.showField('lastname')"/>
                        <IodInput type="text" label="Suffix" v-model="form.suffix" v-show="profiles.showField('suffix')"/>
                        <IodInput type="text" label="Spitzname" v-model="form.nickname" v-show="profiles.showField('nickname')"/>
                        <IodInput type="text" label="Rechtlicher Name" v-model="form.legalname" v-show="profiles.showField('legalname')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Organisation / Firma" v-model="form.organisation" v-show="profiles.showField('organisation')"/>
                        <IodInput type="text" label="Abteilung" v-model="form.department" v-show="profiles.showField('department')"/>
                        <IodInput type="text" label="Position" v-model="form.job_title" v-show="profiles.showField('job_title')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Kunden-Nr." v-model="form.customer_id" v-show="profiles.showField('customer_id')"/>
                        <IodInput type="text" label="Personal-Nr." v-model="form.employee_id" v-show="profiles.showField('employee_id')"/>
                        <IodInput type="text" label="Mitglieds-Nr." v-model="form.member_id" v-show="profiles.showField('member_id')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodToggle type="checkbox" v-model="form.gdpr" v-show="profiles.showField('gdpr')">
                            <template #label>
                                Ich habe die <a target="_blank" href="/privacy">Datenschutzerklärung</a> und die <a target="_blank" href="/terms">AGB</a> gelesen und akzeptiere diese
                            </template>
                        </IodToggle>
                        <IodButton label="Neues Konto registrieren" size="l" corner="pill" :loading="form.processing"/>
                    </div>
    
                    <HeDivider />

                    <pre>{{ profiles }}</pre>
    
                    <div class="flex flex-col gap-y-2 sm:items-center sm:flex-row">
                        <NuxtLink :to="'/login'+redirectQuery">Zurück zur Anmeldung</NuxtLink>
                        <HeSpacer class="hidden sm:block"/>
                    </div>
                </div>
            </HeCard>
        </HeLimiter>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const profiles = useRegisterProfiles()
    const route = useRoute()
    
    const form = useForm({
        email: '',
        phone: '',
        username: '',
        password: '',
        gdpr: false,

        salutation: '',
        prefix: '',
        firstname: '',
        middlename: '',
        lastname: '',
        suffix: '',
        nickname: '',
        legalname: '',

        organisation: '',
        department: '',
        job_title: '',

        customer_id: '',
        employee_id: '',
        member_id: '',
    })

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    async function handleRegister()
    {
        // Prevent register if already logged in
        if (auth.session.authenticated) return

        // // Attempt register
        // const { error } = await auth.register(form.value)

        // // Navigate to dashboard if successful
        // if (!error.value) navigateTo(auth.routes.authHome)
    }
</script>
