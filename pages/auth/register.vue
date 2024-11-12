<template>
    <NuxtLayout name="guest-default" pageTitle="Registrieren">
        <form class="contents" @submit.prevent="submit">
            <div class="flex flex-col items-start min-h-10">
                <IodButton size="xs" variant="text" corner="pill" icon-left="west" label="Zurück zur Anmeldung" normal-case :is="NuxtLink" :to="'/auth/login'+redirectQuery" />
                <h1 class="font-medium m-0">Registrieren</h1>
            </div>
            
            <ErrorAlert :errors="form.errors"/>
    
            <template v-if="sent === false">
                <TransitionGroup :name="'slide-'+direction" tag="div" class="relative">
                    <div class="step" v-if="currentStep === 'profiles'" key="profiles">
                        <IodAlert icon="stacks">
                            <p><b>Anmeldeprofile</b><br>Wählen Sie die Optionen aus, die auf Sie zutreffen.</p>
                        </IodAlert>
                        <div class="bordered-container flex-1 flex items-center gap-4 p-2 select-none" v-for="profile in profiles.customProfiles.value" :key="profile.name" @click="profiles.toggle(profile)" :class="{ 'active': profiles.isSelected(profile), 'disabled': !profiles.isSelectable(profile), }">
                            <IodToggle readonly :modelValue="profiles.isSelected(profile)" style="--local-color-on: var(--color-info)"/>
                            <div class="flex flex-1 flex-col">
                                <h4 class="flex-1 m-0 font-medium !text-lg/6">{{ profile.name }}</h4>
                                <small v-if="profile.description">{{ profile.description }}</small>
                            </div>
                        </div>
                    </div>
        
                    <div class="step" v-if="currentStep === 'credentials'" key="credentials">
                        <IodAlert icon="shield">
                            <p><b>Ihre Logindaten</b><br>Bitte wählen Sie Ihre Logindaten.</p>
                        </IodAlert>
                        <IodInput type="email" label="Email" v-model="form.email" v-show="profiles.hasField('email')"/>
                        <IodInput type="text" label="Telefon" v-model="form.phone" v-show="profiles.hasField('phone')"/>
                        <IodInput type="text" label="Nutzername" v-model="form.username" v-show="profiles.hasField('username')"/>
                        <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password" v-show="profiles.hasField('password')"/>
                    </div>
        
                    <div class="step" v-if="currentStep === 'personal'" key="personal">
                        <IodAlert icon="person">
                            <p><b>Persönliche Angaben</b><br>Geben Sie Informationen über sich an.</p>
                        </IodAlert>
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
    
                        <VDropdown v-show="profiles.hasField('main_address')">
                            <IodInput type="text" label="Hauptadresse" icon-right="location_on" :modelValue="stringFromAddress(form.main_address)" readonly/>
                            <template #popper><IodAddressPicker v-model="form.main_address"/></template>
                        </VDropdown>
    
                        <VDropdown v-show="profiles.hasField('billing_address')">
                            <IodInput type="text" label="Rechnungsadresse" icon-right="location_on" :modelValue="stringFromAddress(form.billing_address)" readonly/>
                            <template #popper><IodAddressPicker v-model="form.billing_address"/></template>
                        </VDropdown>
    
                        <VDropdown v-show="profiles.hasField('shipping_address')">
                            <IodInput type="text" label="Versandadresse" icon-right="location_on" :modelValue="stringFromAddress(form.shipping_address)" readonly/>
                            <template #popper><IodAddressPicker v-model="form.shipping_address"/></template>
                        </VDropdown>
                    </div>
        
                    <div class="step" v-if="currentStep === 'company'" key="company">
                        <IodAlert icon="store">
                            <p><b>Angaben zum Unternehmen</b><br>Geben Sie hier Daten zu Ihrem Unternehmen an.</p>
                        </IodAlert>
                        <IodInput type="text" label="Name des Unternehmen / Organisation" v-model="form.organisation" v-show="profiles.hasField('organisation')"/>
                        <IodInput type="text" label="Abteilung" v-model="form.department" v-show="profiles.hasField('department')"/>
                        <IodInput type="text" label="Position" v-model="form.job_title" v-show="profiles.hasField('job_title')"/>
                        <IodInput type="text" label="Kunden-Nr." v-model="form.customer_id" v-show="profiles.hasField('customer_id')"/>
                    </div>
        
                    <div class="step" v-if="currentStep === 'final'" key="final">
                        <IodAlert icon="send">
                            <b>Registrierung abschließen</b><br>
                            Schicken Sie Ihre Registrierung ab.
                        </IodAlert>
    
                        <div class="bordered-container flex-1 flex items-center gap-4 p-2 select-none" @click="form.gdpr = !form.gdpr" :class="{'active': form.gdpr,}">
                            <IodToggle v-model="form.gdpr" style="--local-color-on: var(--color-info)" @click.stop/>
                            <p>
                                Ich habe die <a target="_blank" href="/privacy" @click.stop>Datenschutzerklärung</a>
                                und die <a target="_blank" href="/terms" @click.stop>AGBs</a> gelesen und akzeptiere diese
                            </p>
                        </div>
                    </div>
                </TransitionGroup>
        
        
                <div class="flex items-center gap-4 pt-2">
                    <IodButton type="button" class="w-40" label="Zurück" corner="pill" variant="contained" :loading="form.processing" @click="prevStep()" :disabled="currentStepIndex <= 0"/>
                    <span class="flex-1 text-center font-mono">{{ currentStepIndex+1 }}/{{ totalSteps }}</span>
                    <IodButton type="button" class="w-40" label="Weiter" corner="pill" variant="filled" :loading="form.processing" @click="nextStep()" v-if="currentStep !== 'final'"/>
                    <IodButton type="submit" class="w-40" label="Registrieren" corner="pill" :loading="form.processing" :disabled="!isValid" v-if="currentStep === 'final'"/>
                </div>
            </template>

            <IodAlert type="success" v-else>
                <b>Sie haben sich erfolgreich registriert!<br><br></b>
                <template v-if="profiles.hasField('email')">
                    <span>Wir haben Ihnen einen Link zum Aktivieren Ihres Kontos an Ihre Email-Adresse gesendet!<br><br></span>
                    <b>Bitte schauen Sie auch in Ihrem Spam- oder Junk-Ordner.</b>
                </template>
            </IodAlert>
        </form>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const profiles = useRegisterProfiles()
    const route = useRoute()
    const NuxtLink = defineNuxtLink({})

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
            'main_address',
            'billing_address',
            'shipping_address',
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
    const direction = ref('')
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
        direction.value = 'forwards'
    }

    function prevStep()
    {
        if (currentStepIndex.value - 1 < 0) return
        currentStep.value = steps.value[currentStepIndex.value - 1]
        direction.value = 'backwards'
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

        main_address: null,
        billing_address: null,
        shipping_address: null,

        organisation: '',
        department: '',
        job_title: '',

        customer_id: '',
        employee_id: '',
        member_id: '',
    })
    const sent = ref(false)

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
                sent.value = true
            }
        })
    }
</script>

<style lang="sass" scoped>
    .slide-forwards-enter-active,
    .slide-backwards-enter-active,
    .slide-forwards-leave-active,
    .slide-backwards-leave-active,
    .slide-forwards-move,
    .slide-backwards-move
        transition: all 300ms ease

    .slide-forwards-leave-active,
    .slide-backwards-leave-active
        position: absolute !important

    .slide-forwards-enter-from,
    .slide-backwards-leave-to
        transform: translateX(2rem)
        opacity: 0

    .slide-forwards-leave-to,
    .slide-backwards-enter-from
        transform: translateX(-2rem)
        opacity: 0



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

    .step
        width: 100%
        display: flex
        flex-direction: column
        gap: 1rem

    .step-description
        display: flex
        align-items: center
        gap: 1rem
        padding: .75rem 1rem
        background: var(--color-background-soft)
        border-radius: var(--radius-l)

        > p
            line-height: 1.5

        > p b
            color: var(--color-text)
</style>