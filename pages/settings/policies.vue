<template>
    <form class="contents" @submit.prevent="save()">
        <SettingsTitle>Domänen Richtlinien</SettingsTitle>
        <SettingsRow title="Nutzer können sich neu registrieren">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_allow_registration" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihr Passwort zurücksetzen">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_allow_password_reset" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihre Email selber ändern">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_allow_email_change" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihren Benutzernamen selber ändern">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_allow_username_change" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihr Profilbild selber ändern">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_allow_avatar_upload" />
        </SettingsRow>
        <SettingsRow title="Nutzer können ihr Profilbanner selber ändern">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_allow_banner_upload" />
        </SettingsRow>
        <HeDivider />
        <SettingsRow title="Debug Modus">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_debug_mode" />
        </SettingsRow>
        <SettingsRow title="Entwickler Modus">
            <IodToggle type="switch" class="ml-auto" v-model="form.policy_developer_mode" />
        </SettingsRow>
        <SettingsRow>
            <IodButton class="flex-1" corner="pill" label="Speichern" :loading="form.processing"/>
        </SettingsRow>
    </form>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const domain = useDomainStore()

    const form = useForm({
        policy_allow_registration: domain.policy('allow_registration') ?? false,
        policy_allow_password_reset: domain.policy('allow_password_reset') ?? true,
        policy_allow_email_change: domain.policy('allow_email_change') ?? false,
        policy_allow_username_change: domain.policy('allow_username_change') ?? false,
        policy_allow_avatar_upload: domain.policy('allow_avatar_upload') ?? false,
        policy_allow_banner_upload: domain.policy('allow_banner_upload') ?? false,
        policy_debug_mode: domain.policy('debug_mode') ?? false,
        policy_developer_mode: domain.policy('developer_mode') ?? false,
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
