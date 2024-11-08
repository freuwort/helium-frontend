<template>
    <NuxtLayout name="guest-default" pageTitle="Registrieren">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>

                    <div class="flex items-center min-h-10">
                        <h1 class="flex-1 font-medium m-0">Registrieren</h1>
                        <span class="font-mono">Schritt {{ currentStepIndex+1 }}/{{ totalSteps }}</span>
                    </div>

                    <HeDivider />

                    <div class="flex flex-col gap-4" v-show="currentStep === 'profiles'">
                        <div class="flex items-center gap-4 px-2 pb-2">
                            <IodIcon icon="stacks" />
                            <p><b class="color-text">Anmeldeprofile</b><br>Wählen Sie die Optionen aus, die auf Sie zutreffen.</p>
                        </div>
                        <div class="bordered-container flex-1 flex items-center gap-4 p-2 select-none" v-for="profile in profiles.customProfiles.value" :key="profile.name" @click="profiles.toggle(profile)" :class="{
                            'active': profiles.isSelected(profile),
                            'disabled': !profiles.isSelectable(profile),
                        }">
                            <IodToggle readonly :modelValue="profiles.isSelected(profile)" style="--local-color-on: var(--color-info)"/>
                            <div class="flex flex-1 flex-col">
                                <h4 class="flex-1 m-0 font-medium !text-lg/6">{{ profile.name }}</h4>
                                <small v-if="profile.description">{{ profile.description }}</small>
                            </div>
                        </div>
                    </div>
    
                    <div class="flex flex-col gap-4" v-show="currentStep === 'credentials'">
                        <div class="flex items-center gap-4 px-2 pb-2">
                            <IodIcon icon="shield" />
                            <p><b class="color-text">Ihre Logindaten</b><br>Bitte wählen Sie Ihre Logindaten.</p>
                        </div>
                        <IodInput type="email" label="Email" v-model="form.email" v-show="profiles.hasField('email')"/>
                        <IodInput type="text" label="Telefon" v-model="form.phone" v-show="profiles.hasField('phone')"/>
                        <IodInput type="text" label="Nutzername" v-model="form.username" v-show="profiles.hasField('username')"/>
                        <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password" v-show="profiles.hasField('password')"/>
                    </div>

                    <div class="flex flex-col gap-4" v-show="currentStep === 'personal'">
                        <div class="flex items-center gap-4 px-2 pb-2">
                            <IodIcon icon="person" />
                            <p><b class="color-text">Persönliche Angaben</b><br>Geben Sie Informationen über sich an.</p>
                        </div>
                        <IodInput type="text" label="Anrede" v-model="form.salutation" v-show="profiles.hasField('salutation')"/>
                        <IodInput type="text" label="Titel" v-model="form.prefix" v-show="profiles.hasField('prefix')"/>
                        <IodInput type="text" label="Vorname" v-model="form.firstname" v-show="profiles.hasField('firstname')"/>
                        <IodInput type="text" label="Zweiter Vorname" v-model="form.firstname" v-show="profiles.hasField('middlename')"/>
                        <IodInput type="text" label="Nachname" v-model="form.lastname" v-show="profiles.hasField('lastname')"/>
                        <IodInput type="text" label="Suffix" v-model="form.suffix" v-show="profiles.hasField('suffix')"/>
                        <IodInput type="text" label="Spitzname" v-model="form.nickname" v-show="profiles.hasField('nickname')"/>
                        <IodInput type="text" label="Rechtlicher Name" v-model="form.legalname" v-show="profiles.hasField('legalname')"/>
                        <IodInput type="text" label="Personal-Nr." v-model="form.employee_id" v-show="profiles.hasField('employee_id')"/>
                        <IodInput type="text" label="Mitglieds-Nr." v-model="form.member_id" v-show="profiles.hasField('member_id')"/>
                    </div>

                    <div class="flex flex-col gap-4" v-show="currentStep === 'company'">
                        <div class="flex items-center gap-4 px-2 pb-2">
                            <IodIcon icon="store" />
                            <p><b class="color-text">Angaben zum Unternehmen</b><br>Geben Sie hier Daten zu Ihrem Unternehmen an.</p>
                        </div>
                        <IodInput type="text" label="Name des Unternehmen / Organisation" v-model="form.organisation" v-show="profiles.hasField('organisation')"/>
                        <IodInput type="text" label="Abteilung" v-model="form.department" v-show="profiles.hasField('department')"/>
                        <IodInput type="text" label="Position" v-model="form.job_title" v-show="profiles.hasField('job_title')"/>
                        <IodInput type="text" label="Kunden-Nr." v-model="form.customer_id" v-show="profiles.hasField('customer_id')"/>
                    </div>

                    <div class="flex flex-col gap-4" v-show="currentStep === 'final'">
                        <div class="flex items-center gap-4 px-2 pb-2">
                            <IodIcon icon="pageview" />
                            <p><b class="color-text">Angaben überprüfen</b><br>Überprüfen Sie Ihre Angaben</p>
                        </div>
                        <div class="bordered-container flex-1 flex items-center gap-4 p-2 select-none" @click="form.gdpr = !form.gdpr" :class="{'active': form.gdpr,}">
                            <IodToggle v-model="form.gdpr" style="--local-color-on: var(--color-info)" @click.stop/>
                            <p>
                                Ich habe die <a target="_blank" href="/privacy" @click.stop>Datenschutzerklärung</a>
                                und die <a target="_blank" href="/terms" @click.stop>AGBs</a> gelesen und akzeptiere diese
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4 pt-2">
                        <IodButton type="button" label="Zurück" corner="pill" variant="contained" @click="prevStep()" v-if="currentStepIndex > 0"/>
                        <HeSpacer />
                        <IodButton label="Neues Konto registrieren" corner="pill" :disabled="!isValid" :loading="form.processing" v-if="currentStep === 'final'"/>
                        <IodButton label="Weiter" corner="pill" variant="filled" @click="nextStep()" v-else/>
                    </div>
    
                    <HeDivider />
    
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

    // START: Stepper
    const steps = computed<string[]>(() => {
        let steps = []

        if (profiles.customProfiles.value.length > 0) {
            steps.push('profiles')
        }

        if (arrayIntersect(profiles.compiledProfile.value.fields, [
            'email',
            'phone',
            'username',
            'password',
        ]).length > 0) steps.push('credentials')

        if (arrayIntersect(profiles.compiledProfile.value.fields, [
            'salutation',
            'prefix',
            'firstname',
            'middlename',
            'lastname',
            'suffix',
            'nickname',
            'legalname',
            'employee_id',
            'member_id',
        ]).length > 0) steps.push('personal')

        if (arrayIntersect(profiles.compiledProfile.value.fields, [
            'organisation',
            'department',
            'job_title',
            'customer_id',
        ]).length > 0) steps.push('company')

        steps.push('final')

        return steps
    })

    const currentStep = ref('')
    const currentStepIndex = computed(() => steps.value.indexOf(currentStep.value))
    const totalSteps = computed(() => steps.value.length)

    watch(steps, () => {
        if (steps.value.includes(currentStep.value)) return
        if (steps.value[0] === currentStep.value) return

        currentStep.value = steps.value[0]
    }, { immediate: true })

    function nextStep()
    {
        if (currentStepIndex.value + 1 >= totalSteps.value) return
        currentStep.value = steps.value[currentStepIndex.value + 1]
    }

    function prevStep()
    {
        if (currentStepIndex.value - 1 < 0) return
        currentStep.value = steps.value[currentStepIndex.value - 1]
    }
    // END: Stepper
    
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
        border-radius: var(--radius-l)
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