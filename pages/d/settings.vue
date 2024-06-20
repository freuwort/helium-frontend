<template>
    <NuxtLayout name="auth-default" pageTitle="Einstellungen" color="#363E40">
        <HeCard>
            <HeFlex horizontal align-y="stretch">
                <HeFlex padding="1.5rem 0" align-y="flex-start" class="w-80 border-r">
                    <ContextMenuLabel label="Benutzer Konto"/>
                    <ContextMenuItem to="/d/settings/personal" icon="settings" label="Allgemeines" :active="isRoute('d-settings-personal')" />

                    <ContextMenuLabel label="Domain" class="mt-1"/>
                    <ContextMenuItem to="/d/settings/" icon="domain" label="System" :active="isRoute('d-settings')" />
                    <ContextMenuItem to="/d/settings/units" icon="square_foot" label="Einheiten" :active="isRoute('d-settings-units')" />
                    <ContextMenuItem to="/d/settings/policies" icon="policy" label="Richtlinien" :active="isRoute('d-settings-policies')" />
                    <ContextMenuItem to="/d/settings/legal" icon="gavel" label="Rechtliches" :active="isRoute('d-settings-legal')" />
                    
                    <ContextMenuLabel label="Debug" class="mt-1"/>
                    <ContextMenuItem to="/d/settings/debug" icon="bug_report" label="Debug" :active="isRoute('d-settings-debug')" />
                </HeFlex>
                <HeFlex padding="1.5rem" gap="1rem" align-y="flex-start" class="flex-1">
                    <NuxtPage />
                </HeFlex>
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })
</script>

<style lang="sass" scoped></style>
