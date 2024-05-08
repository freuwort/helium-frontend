<template>
    <NuxtLayout name="auth-default" pageTitle="Einstellungen" color="#363E40">
        <Card>
            <HeFlex horizontal align-y="stretch">
                <HeFlex padding="2rem 0" align-y="flex-start" class="w-80 border-r">
                    <ContextMenuLabel label="Benutzer Konto"/>
                    <ContextMenuItem to="/d/settings/personal" icon="settings" label="Allgemeines" :active="isRoute('d-settings-personal')" />

                    <ContextMenuLabel label="Domain" class="mt-1"/>
                    <ContextMenuItem to="/d/settings/" icon="store" label="System" :active="isRoute('d-settings')" />
                    <ContextMenuItem to="/d/settings/debug" icon="bug_report" label="Debug" :active="isRoute('d-settings-debug')" />
                </HeFlex>
                <HeFlex padding="2rem" gap="1rem" align-y="flex-start" class="flex-1">
                    <NuxtPage />
                </HeFlex>
            </HeFlex>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })
</script>

<style lang="sass" scoped></style>
