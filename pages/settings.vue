<template>
    <NuxtLayout name="auth-default" :scope pageTitle="Einstellungen">
        <HeCard>
            <HeFlex horizontal align-y="stretch">
                <HeFlex padding="1rem 0" align-y="flex-start" class="w-80 border-r">
                    <ContextMenuItem to="/settings/" icon="domain" label="Domain" :active="isRoute('settings')" />
                    <ContextMenuItem to="/settings/policies" icon="policy" label="Richtlinien" :active="isRoute('settings-policies')" />
                    <ContextMenuItem to="/settings/units" icon="square_foot" label="Einheiten" :active="isRoute('settings-units')" />
                    <ContextMenuItem to="/settings/register" icon="patient_list" label="Registrierung" :active="isRoute('settings-register')" />
                    <ContextMenuDivider v-if="debugMode"/>
                    <ContextMenuItem v-if="debugMode" to="/settings/debug" icon="bug_report" label="Debug" :active="isRoute('settings-debug')" />
                    <ContextMenuItem v-if="debugMode" to="/settings/components" icon="buttons_alt" label="Komponenten" :active="isRoute('settings-components')" />
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
