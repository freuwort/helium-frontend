<template>
    <NuxtLayout name="auth-default" :scope pageTitle="Einstellungen">
        <HeCard>
            <HeFlex horizontal align-y="stretch">
                <HeFlex padding="1rem 0" align-y="flex-start" class="w-80 border-r">
                    <ContextMenuItem to="/settings/" icon="domain" label="System" :active="isRoute('d-settings')" />
                    <ContextMenuItem to="/settings/legal" icon="gavel" label="Rechtliches" :active="isRoute('d-settings-legal')" />
                    <ContextMenuItem to="/settings/units" icon="square_foot" label="Einheiten" :active="isRoute('d-settings-units')" />
                    <ContextMenuItem to="/settings/policies" icon="policy" label="Richtlinien" :active="isRoute('d-settings-policies')" />
                    <ContextMenuItem to="/settings/debug" icon="bug_report" label="Debug" :active="isRoute('d-settings-debug')" />
                </HeFlex>

                <HeFlex padding="1rem" gap="1rem" align-y="flex-start" class="flex-1">
                    <NuxtPage />
                </HeFlex>
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: ['auth', '2fa-verified'],
    })

    const scope = 'view_admin_settings_show'
</script>

<style lang="sass" scoped></style>
