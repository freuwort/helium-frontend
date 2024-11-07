<template>
    <form class="contents" @submit.prevent="saveCompany()">
        <div class="flex items-center min-h-10">
            <h3 class="flex-1 m-0 font-medium">Organisation</h3>
            <IodButton corner="pill" label="Speichern" icon-right="save" :loading="companyForm.processing"/>
        </div>
        <SettingsRow title="Anzeigename">
            <IodInput class="flex-1" label="Anzeigename" v-model="companyForm.company_name" />
        </SettingsRow>
        <SettingsRow title="Eingetragener Name">
            <IodInput class="flex-1" label="Name" v-model="companyForm.company_legalname" placeholder="Unternehmen GmbH"/>
        </SettingsRow>
        <SettingsRow title="Slogan">
            <IodInput class="flex-1" label="Slogan" v-model="companyForm.company_slogan" />
        </SettingsRow>
        <SettingsRow title="Logo">
            <ProfileImage class="flex-1 bg-background-soft" aspect="2" alt="Firmen Logo" tooltip="Logo hochladen" allow-upload :src="domain.settings.company_logo" :loading="logoProcessing" @upload="logoInput.click()"/>
            <input type="file" class="hidden" ref="logoInput" pattern="image/*" @change="saveLogo(($event.target as any).files[0])" />
        </SettingsRow>
        <HeSpacer class="pb-4"/>
    </form>
    
    <form class="contents" @submit.prevent="saveLegal()">
        <div class="flex items-center min-h-10">
            <h3 class="flex-1 m-0 font-medium">Rechtstexte</h3>
            <IodButton corner="pill" label="Speichern" icon-right="save" :loading="legalForm.processing"/>
        </div>
        <SettingsRow title="Link zur Impressum Seite">
            <IodInput class="flex-1" v-model="legalForm.legal_notice" placeholder="beispiel.de/impressum"/>
        </SettingsRow>
        <SettingsRow title="Link zur Datenschutz Seite">
            <IodInput class="flex-1" v-model="legalForm.legal_privacy" placeholder="beispiel.de/datenschutz"/>
        </SettingsRow>
        <SettingsRow title="Link zur AGBs Seite">
            <IodInput class="flex-1" v-model="legalForm.legal_terms" placeholder="beispiel.de/agbs"/>
        </SettingsRow>
        <HeSpacer class="pb-4"/>
    </form>
    
    
    <form class="contents" @submit.prevent="saveUnit()">
        <div class="flex items-center min-h-10">
            <h3 class="flex-1 m-0 font-medium">Standard Einheiten</h3>
            <IodButton corner="pill" label="Speichern" icon-right="save" :loading="unitForm.processing"/>
        </div>
        <SettingsRow title="Standard Währung">
            <IodSelect class="flex-1" icon-left="attach_money" label="Währung" v-model="unitForm.default_currency" :options="options_currency"/>
        </SettingsRow>
        <SettingsRow title="Standard Längeneinheit">
            <IodSelect class="flex-1" icon-left="straighten" label="Länge in" v-model="unitForm.default_unit_length" :options="options_unit_length"/>
        </SettingsRow>
        <SettingsRow title="Standard Flächeeinheit">
            <IodSelect class="flex-1" icon-left="square_foot" label="Fläche in" v-model="unitForm.default_unit_area" :options="options_unit_area"/>
        </SettingsRow>
        <SettingsRow title="Standard Volumeneinheit">
            <IodSelect class="flex-1" icon-left="deployed_code" label="Volumen in" v-model="unitForm.default_unit_volume" :options="options_unit_volume"/>
        </SettingsRow>
        <SettingsRow title="Standard Gewichtseinheit">
            <IodSelect class="flex-1" icon-left="weight" label="Gewicht in" v-model="unitForm.default_unit_weight" :options="options_unit_weight"/>
        </SettingsRow>
        <SettingsRow title="Standard Temperatureinheit">
            <IodSelect class="flex-1" icon-left="thermometer" label="Temperatur in" v-model="unitForm.default_unit_temperature" :options="options_unit_temperature"/>
        </SettingsRow>
        <SettingsRow title="Standard Geschwindigkeitseinheit">
            <IodSelect class="flex-1" icon-left="speed" label="Geschwindigkeit in" v-model="unitForm.default_unit_speed" :options="options_unit_speed"/>
        </SettingsRow>
    </form>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    const options_currency = ref([
        { value: 'EUR', text: 'EUR', },
        { value: 'USD', text: 'USD', },
        { value: 'GBP', text: 'GBP', },
    ])

    const options_unit_length = ref([
        { value: 'm', text: 'Meter', },
        { value: 'ft', text: 'Fuß', },
    ])

    const options_unit_area = ref([
        { value: 'sqm', text: 'Quadratmeter', },
        { value: 'sqft', text: 'Quadratfuß', },
    ])

    const options_unit_volume = ref([
        { value: 'l', text: 'Liter', },
        { value: 'gal', text: 'Gallone', },
    ])
    
    const options_unit_weight = ref([
        { value: 'kg', text: 'Kilogramm', },
        { value: 'lb', text: 'Pfund', },
    ])

    const options_unit_temperature = ref([
        { value: 'c', text: 'Celsius', },
        { value: 'f', text: 'Fahrenheit', },
    ])

    const options_unit_speed = ref([
        { value: 'kmh', text: 'km/h', },
        { value: 'mph', text: 'mph', },
    ])



    // START: Company logo
    const logoInput = ref()
    const logoProcessing = ref(false)

    async function saveLogo(file: any) {
        if (!file) return

        logoProcessing.value = true
        await useAxios().postForm('/api/settings/logo', {file})
        await domain.fetchSettings()
        logoInput.value.value = null
        logoProcessing.value = false
    }
    // END: Company logo



    // START: Company settings
    const companyForm = useForm({
        company_name: domain?.settings?.company_name ?? '',
        company_legalname: domain?.settings?.company_legalname ?? '',
        company_slogan: domain?.settings?.company_slogan ?? '',
    })

    function saveCompany() {
        companyForm.patch('/api/settings', {
            onSuccess() {
                toast.success('Einstellungen gespeichert')
                domain.fetchSettings()
            }
        })
    }
    // END: Company settings



    // START: Legal settings
    const legalForm = useForm({
        legal_notice: domain?.settings?.legal_notice ?? '',
        legal_privacy: domain?.settings?.legal_privacy ?? '',
        legal_terms: domain?.settings?.legal_terms ?? '',
    })

    function saveLegal() {
        legalForm.patch('/api/settings', {
            onSuccess() {
                toast.success('Einstellungen gespeichert')
                domain.fetchSettings()
            }
        })
    }
    // END: Legal settings



    // START: Unit settings
    const unitForm = useForm({
        default_currency: domain?.settings?.default_currency ?? 'EUR',
        default_unit_length: domain?.settings?.default_unit_length ?? 'm',
        default_unit_area: domain?.settings?.default_unit_area ?? 'sqm',
        default_unit_volume: domain?.settings?.default_unit_volume ?? 'l',
        default_unit_weight: domain?.settings?.default_unit_weight ?? 'kg',
        default_unit_temperature: domain?.settings?.default_unit_temperature ?? 'c',
        default_unit_speed: domain?.settings?.default_unit_speed ?? 'kmh',
    })

    function saveUnit() {
        unitForm.patch('/api/settings', {
            onSuccess() {
                toast.success('Einstellungen gespeichert')
                domain.fetchSettings()
            }
        })
    }
    // END: Unit settings
</script>

<style lang="sass" scoped>
    .w-18
        width: 18rem !important
</style>
