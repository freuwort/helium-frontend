<template>
    <form class="contents" @submit.prevent="save()">
        <SettingsTitle>Firmen Einstellungen</SettingsTitle>
        <SettingsRow title="Firmen Anzeigename" description="Der Name der Firma, welcher in Helium angezeigt wird">
            <IodInput class="flex-1" label="Anzeigename" v-model="form.company_name" />
        </SettingsRow>
        <SettingsRow title="Eingetragener Firmenname" description="Der offizielle Name der Firma">
            <IodInput class="flex-1" label="Name" v-model="form.company_legalname" placeholder="Unternehmen GmbH"/>
        </SettingsRow>
        <SettingsRow title="Slogan" description="Ein kurzer Slogan, welcher in Helium angezeigt wird">
            <IodInput class="flex-1" label="Slogan" v-model="form.company_slogan" />
        </SettingsRow>
        <SettingsRow title="Logo" description="Das Firmen Logo, welches in Helium angezeigt wird">
            <IodInput class="flex-1" label="Logo" v-model="form.company_logo" placeholder="https://example.com/logo.png"/>
        </SettingsRow>
        <SettingsRow title="Favicon" description="Das Favicon, welches in Helium angezeigt wird">
            <IodInput class="flex-1" label="Favicon" v-model="form.company_favicon" placeholder="https://example.com/favicon.ico"/>
        </SettingsRow>
    
        <SettingsSpacer />
        <SettingsTitle>Standard Einstellungen</SettingsTitle>
        <SettingsRow title="Währung" description="Wählen Sie Ihre standard Währung">
            <IodSelect class="flex-1" label="Währung" v-model="form.default_currency" :options="options_currency"/>
        </SettingsRow>
        <SettingsRow title="Länge" description="Wählen Sie Ihre standard Längeneinheit">
            <IodSelect class="flex-1" label="Länge" v-model="form.default_unit_length" :options="options_unit_length"/>
        </SettingsRow>
        <SettingsRow title="Gewicht" description="Wählen Sie Ihre standard Gewichtseinheit">
            <IodSelect class="flex-1" label="Gewicht" v-model="form.default_unit_weight" :options="options_unit_weight"/>
        </SettingsRow>
        <SettingsRow title="Volumen" description="Wählen Sie Ihre standard Volumeneinheit">
            <IodSelect class="flex-1" label="Volumen" v-model="form.default_unit_volume" :options="options_unit_volume"/>
        </SettingsRow>
        <SettingsRow title="Temperatur" description="Wählen Sie Ihre standard Temperatureinheit">
            <IodSelect class="flex-1" label="Temperatur" v-model="form.default_unit_temperature" :options="options_unit_temperature"/>
        </SettingsRow>
        <SettingsRow title="Geschwindigkeit" description="Wählen Sie Ihre standard Geschwindigkeitseinheit">
            <IodSelect class="flex-1" label="Geschwindigkeit" v-model="form.default_unit_speed" :options="options_unit_speed"/>
        </SettingsRow>
        <SettingsRow>
            <IodButton class="flex-1" label="Speichern" :loading="form.processing"/>
        </SettingsRow>
    </form>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    const form = useForm({
        company_name: domain?.settings?.company_name ?? '',
        company_legalname: domain?.settings?.company_legalname ?? '',
        company_slogan: domain?.settings?.company_slogan ?? '',
        company_logo: domain?.settings?.company_logo ?? '',
        company_favicon: domain?.settings?.company_favicon ?? '',
        default_currency: domain?.settings?.default_currency ?? 'EUR',
        default_unit_length: domain?.settings?.default_unit_length ?? 'm',
        default_unit_weight: domain?.settings?.default_unit_weight ?? 'kg',
        default_unit_volume: domain?.settings?.default_unit_volume ?? 'l',
        default_unit_temperature: domain?.settings?.default_unit_temperature ?? 'c',
        default_unit_speed: domain?.settings?.default_unit_speed ?? 'kmh',
    })

    const options_currency = ref([
        { value: 'EUR', text: 'EUR', },
        { value: 'USD', text: 'USD', },
        { value: 'GBP', text: 'GBP', },
    ])

    const options_unit_length = ref([
        { value: 'm', text: 'Meter', },
        { value: 'ft', text: 'Fuß', },
    ])

    const options_unit_weight = ref([
        { value: 'kg', text: 'Kilogramm', },
        { value: 'lb', text: 'Pfund', },
    ])

    const options_unit_volume = ref([
        { value: 'l', text: 'Liter', },
        { value: 'gal', text: 'Gallone', },
    ])

    const options_unit_temperature = ref([
        { value: 'c', text: 'Celsius', },
        { value: 'f', text: 'Fahrenheit', },
    ])

    const options_unit_speed = ref([
        { value: 'kmh', text: 'km/h', },
        { value: 'mph', text: 'mph', },
    ])



    function save() 
    {
        form.patch('/api/settings', {
            onSuccess() {
                toast.success('Einstellungen gespeichert')
                domain.fetchSettings()
            }
        })
    }
</script>

<style lang="sass" scoped>
    .w-18
        width: 18rem !important
</style>
