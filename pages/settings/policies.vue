<template>
    <div class="flex items-center min-h-10">
        <h3 class="flex-1 m-0 font-medium">Domänen Richtlinien</h3>
    </div>

    <ErrorAlert :errors="form.errors" class="mb-8" />

    <form class="contents" @submit.prevent="save()">
        <SettingsRow>
            <template #description>
                <span class="font-heading color-text font-medium">Nutzer können sich registrieren</span>
                <small><NuxtLink to="/settings/register">Stellen Sie ein, was Nutzer bei der Registrierung angeben können und sollen.</NuxtLink></small>
            </template>

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
        <div class="flex items-center min-h-10">
            <HeSpacer />
            <IodButton corner="pill" label="Speichern" icon-right="save" :loading="form.processing"/>
        </div>
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
