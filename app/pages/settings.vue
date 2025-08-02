<template>
    <NuxtLayout name="auth-default" :scope pageTitle="Einstellungen">
        <div class="flex items-stretch h-full w-full">
            <div class="flex flex-col w-64 py-4 border-r overflow-y-auto small-scrollbar">
                <ContextMenuItem to="/settings/" icon="domain" label="Domain" :active="routeIsCurrent('settings')" />
                <ContextMenuItem to="/settings/policies" icon="policy" label="Richtlinien" :active="routeIsCurrent('settings-policies')" />
                <!-- <ContextMenuItem to="/settings/units" icon="square_foot" label="Einheiten" :active="routeIsCurrent('settings-units')" /> -->
                <ContextMenuItem to="/settings/register" icon="patient_list" label="Registrierung" :active="routeIsCurrent('settings-register')" />
                <ContextMenuItem to="/settings/backups" icon="hard_drive" label="Backups" :active="routeIsCurrent('settings-backups')" />
            </div>

            <div class="flex flex-col flex-1 p-4 gap-2 overflow-y-auto small-scrollbar">
                <NuxtPage />
            </div>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const debugMode = useDebugMode()
    const scope = 'view_admin_settings_show'
</script>

<style lang="sass" scoped></style>
