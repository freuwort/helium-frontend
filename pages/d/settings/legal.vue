<template>
    <form class="contents" @submit.prevent="save()">
        <SettingsTitle>Impressum</SettingsTitle>
        <TextEditor v-model="form.legal_notice" />

        <SettingsSpacer />
        <SettingsTitle>Datenschutz</SettingsTitle>
        <TextEditor v-model="form.legal_privacy" />

        <SettingsSpacer />
        <SettingsRow>
            <IodButton class="flex-1" corner="pill" label="Speichern" :loading="form.processing"/>
        </SettingsRow>
    </form>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    const form = useForm({
        legal_notice: domain?.settings?.legal_notice ?? '',
        legal_privacy: domain?.settings?.legal_privacy ?? '',
    })



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
