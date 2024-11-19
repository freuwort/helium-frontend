<template>
    <NuxtLayout name="auth-default" :scope pageTitle="Einstellungen">
        <HeCard>
            <HeFlex horizontal align-y="stretch">
                <HeFlex padding="1rem 0" align-y="flex-start" class="w-80 border-r">
                    <ContextMenuLabel label="Allgemein"/>
                    <ContextMenuItem to="/settings/" icon="domain" label="Domain" :active="routeIsCurrent('settings')" />
                    <ContextMenuItem to="/settings/policies" icon="policy" label="Richtlinien" :active="routeIsCurrent('settings-policies')" />
                    <ContextMenuItem to="/settings/units" icon="square_foot" label="Einheiten" :active="routeIsCurrent('settings-units')" />
                    <ContextMenuItem to="/settings/register" icon="patient_list" label="Registrierung" :active="routeIsCurrent('settings-register')" />
                    <ContextMenuDivider v-if="debugMode"/>
                    <ContextMenuLabel v-if="debugMode" label="Debug"/>
                    <ContextMenuItem v-if="debugMode" to="/settings/debug" icon="bug_report" label="Debug" :active="routeIsCurrent('settings-debug')" />
                    <ContextMenuItem v-if="debugMode" to="/settings/components" icon="buttons_alt" label="Komponenten" :active="routeIsCurrent('settings-components')" />
                </HeFlex>

                <HeFlex padding="1rem" gap="1rem" align-y="flex-start" class="flex-1">
                    <NuxtPage />
                </HeFlex>
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const debugMode = useDebugMode()
    const scope = 'view_admin_settings_show'
</script>

<style lang="sass" scoped></style>
