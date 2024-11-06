<template>
    <NuxtLayout name="guest-default" pageTitle="Registrieren">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Registrieren</h1>

                    <div class="flex flex-col gap-4 relative">
                        <div class="bordered-container flex-1 flex items-center gap-4 p-2 select-none" v-for="profile in profiles.customProfiles.value" :key="profile.name" @click="profiles.toggle(profile)" :class="{
                            'active': profiles.isSelected(profile),
                            'disabled': !profiles.isSelectable(profile),
                        }">
                            <IodToggle readonly :modelValue="profiles.isSelected(profile)" style="--local-color-on: var(--color-info)"/>
                            <h3 class="font-medium m-0 text-lg">{{ profile.name }}</h3>
                        </div>
                    </div>
    
                    <div class="flex flex-col gap-4">
                        <IodInput type="email" label="Email" v-model="form.email" v-show="profiles.hasField('email')"/>
                        <IodInput type="text" label="Telefon" v-model="form.phone" v-show="profiles.hasField('phone')"/>
                        <IodInput type="text" label="Nutzername" v-model="form.username" v-show="profiles.hasField('username')"/>
                        <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password" v-show="profiles.hasField('password')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Anrede" v-model="form.salutation" v-show="profiles.hasField('salutation')"/>
                        <IodInput type="text" label="Titel" v-model="form.prefix" v-show="profiles.hasField('prefix')"/>
                        <IodInput type="text" label="Vorname" v-model="form.firstname" v-show="profiles.hasField('firstname')"/>
                        <IodInput type="text" label="Zweiter Vorname" v-model="form.firstname" v-show="profiles.hasField('middlename')"/>
                        <IodInput type="text" label="Nachname" v-model="form.lastname" v-show="profiles.hasField('lastname')"/>
                        <IodInput type="text" label="Suffix" v-model="form.suffix" v-show="profiles.hasField('suffix')"/>
                        <IodInput type="text" label="Spitzname" v-model="form.nickname" v-show="profiles.hasField('nickname')"/>
                        <IodInput type="text" label="Rechtlicher Name" v-model="form.legalname" v-show="profiles.hasField('legalname')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Organisation / Firma" v-model="form.organisation" v-show="profiles.hasField('organisation')"/>
                        <IodInput type="text" label="Abteilung" v-model="form.department" v-show="profiles.hasField('department')"/>
                        <IodInput type="text" label="Position" v-model="form.job_title" v-show="profiles.hasField('job_title')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Kunden-Nr." v-model="form.customer_id" v-show="profiles.hasField('customer_id')"/>
                        <IodInput type="text" label="Personal-Nr." v-model="form.employee_id" v-show="profiles.hasField('employee_id')"/>
                        <IodInput type="text" label="Mitglieds-Nr." v-model="form.member_id" v-show="profiles.hasField('member_id')"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodToggle type="checkbox" v-model="form.gdpr" v-show="profiles.hasField('gdpr')">
                            <template #label>
                                Ich habe die <a target="_blank" href="/privacy">Datenschutzerklärung</a> und die <a target="_blank" href="/terms">AGB</a> gelesen und akzeptiere diese
                            </template>
                        </IodToggle>
                        <IodButton label="Neues Konto registrieren" size="l" corner="pill" :disabled="!isValid" :loading="form.processing"/>
                    </div>
    
                    <HeDivider />

                    <pre>{{ profiles.compiledProfile }}</pre>
    
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

    const isValid = computed(() => {
        if (auth.session.authenticated) return false
        if (profiles.compiledProfile.value?.valid !== true) return false

        let requiredFields = profiles.compiledProfile.value?.fields ?? []
        if (!requiredFields.every(field => (form.data() as {[key: string]: any})[field])) return false

        return true
    })

    async function submit()
    {
        if (!isValid.value) return

        form
        .transform(data => ({
            ...data,
            profiles: profiles.compiledProfile.value?.profiles || [],
        }))
        .post(auth.apiRoutes.register, {
            onSuccess: () => {
                console.log('Form success')
            }
        })

        // // Attempt register
        // const { error } = await auth.register(form.value)

        // // Navigate to dashboard if successful
        // if (!error.value) navigateTo(auth.routes.authHome)
    }
</script>

<style lang="sass" scoped>
    .bordered-container
        background: var(--color-background)
        border: 2px solid var(--color-border)
        border-radius: var(--radius-xl)
        backdrop-filter: blur(15px)
        position: relative

        &:hover,
        &:focus
            border-color: var(--color-border-focused)

        &.active
            border-color: var(--color-info)
            background: #6666ff11
            position: relative
            z-index: 1

        &.disabled,
        &:disabled
            border-color: var(--color-border-disabled)
            opacity: .5
</style>