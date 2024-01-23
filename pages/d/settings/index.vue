<template>
    <form class="display-contents" @submit.prevent="save()">
        <h5 class="margin-0 weight-medium">Firmen Einstellungen</h5>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Firmen Anzeigename</span>
                <small>Der Name der Firma, welcher in Helium angezeigt wird</small>
            </Flex>
            <IodInput label="Anzeigename" v-model="form.company_name" class="w-18"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Eingetragener Firmenname</span>
                <small>Der offizielle Name der Firma</small>
            </Flex>
            <IodInput label="Name" v-model="form.company_legalname" class="w-18" placeholder="Unternehmen GmbH"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Slogan</span>
                <small>Ein kurzer Slogan, welcher in Helium angezeigt wird</small>
            </Flex>
            <IodInput label="Slogan" v-model="form.company_slogan" class="w-18"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Logo</span>
                <small>Das Firmen Logo, welches in Helium angezeigt wird</small>
            </Flex>
            <IodInput label="Logo" v-model="form.company_logo" class="w-18" placeholder="https://example.com/logo.png"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Favicon</span>
                <small>Das Favicon, welches in Helium angezeigt wird</small>
            </Flex>
            <IodInput label="Favicon" v-model="form.company_favicon" class="w-18" placeholder="https://example.com/favicon.ico"/>
        </Flex>
    
        <div class="h-1"></div>
    
        <h5 class="margin-0 weight-medium">Standard Einheiten</h5>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Währung</span>
                <small>Wählen Sie Ihre standard Währung</small>
            </Flex>
            <IodSelect class="w-18" label="Währung" v-model="form.default_currency" :options="options_currency"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Länge</span>
                <small>Wählen Sie Ihre standard Längeneinheit</small>
            </Flex>
            <IodSelect class="w-18" label="Länge" v-model="form.default_unit_length" :options="options_unit_length"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Gewicht</span>
                <small>Wählen Sie Ihre standard Gewichtseinheit</small>
            </Flex>
            <IodSelect class="w-18" label="Gewicht" v-model="form.default_unit_weight" :options="options_unit_weight"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Volumen</span>
                <small>Wählen Sie Ihre standard Volumeneinheit</small>
            </Flex>
            <IodSelect class="w-18" label="Volumen" v-model="form.default_unit_volume" :options="options_unit_volume"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Temperatur</span>
                <small>Wählen Sie Ihre standard Temperatureinheit</small>
            </Flex>
            <IodSelect class="w-18" label="Temperatur" v-model="form.default_unit_temperature" :options="options_unit_temperature"/>
        </Flex>
        <Flex horizontal>
            <Flex class="flex-1">
                <span class="font-heading color-text weight-medium">Geschwindigkeit</span>
                <small>Wählen Sie Ihre standard Geschwindigkeitseinheit</small>
            </Flex>
            <IodSelect class="w-18" label="Geschwindigkeit" v-model="form.default_unit_speed" :options="options_unit_speed"/>
        </Flex>

        <div class="h-1"></div>

        <IodButton class="w-18 margin-left-auto " label="Speichern" :loading="form.processing"/>
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
