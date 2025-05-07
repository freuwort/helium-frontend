<template>
    <h3 class="m-0 text-base font-medium">Domänen Richtlinien</h3>

    <ErrorAlert :errors="form.errors" class="mb-8" />

    <form class="contents" @submit.prevent="save()">
        <SettingsRow title="Nutzer können ihren Namen selber ändern">
            <IodToggle v-model="form.policy_allow_name_change" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihren Benutzernamen selber ändern">
            <IodToggle v-model="form.policy_allow_username_change" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihr Profilbild selber ändern">
            <IodToggle v-model="form.policy_allow_avatar_upload" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihr Profilbanner selber ändern">
            <IodToggle v-model="form.policy_allow_banner_upload" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihr Passwort zurücksetzen">
            <IodToggle v-model="form.policy_allow_password_reset" />
        </SettingsRow>
        <SettingsRow title="Debug Modus">
            <IodToggle v-model="form.policy_debug_mode" />
        </SettingsRow>
        <SettingsRow title="Entwickler Modus">
            <IodToggle v-model="form.policy_developer_mode" />
        </SettingsRow>
        <SettingsRow>
            <IodButton class="flex-1" corner="m" size="s" label="Speichern" :loading="form.processing"/>
        </SettingsRow>
    </form>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    const form = useForm({
        policy_allow_name_change: domain.policy('allow_name_change') ?? false,
        policy_allow_username_change: domain.policy('allow_username_change') ?? false,
        policy_allow_avatar_upload: domain.policy('allow_avatar_upload') ?? false,
        policy_allow_banner_upload: domain.policy('allow_banner_upload') ?? false,

        policy_allow_password_reset: domain.policy('allow_password_reset') ?? true,

        policy_debug_mode: domain.policy('debug_mode') ?? false,
        policy_developer_mode: domain.policy('developer_mode') ?? false,
    })



    function save() {
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
