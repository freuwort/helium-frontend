<template>
    <NuxtLayout name="auth-default" pageTitle="Einstellungen" color="#363E40">
        <Card>
            <Flex horizontal y-align="stretch">
                <Flex padding="2rem 0" y-align="flex-start" class="w-18 border-right-soft">
                    <ContextMenuLabel label="Benutzer Konto"/>
                    <ContextMenuItem to="/d/settings/personal" icon="settings" label="Allgemeines" :active="isRoute('d-settings-personal')" />

                    <ContextMenuLabel label="Domain" class="margin-top-1"/>
                    <ContextMenuItem to="/d/settings/" icon="store" label="System" :active="isRoute('d-settings')" />
                    <ContextMenuItem to="/d/settings/debug" icon="bug_report" label="Debug" :active="isRoute('d-settings-debug')" />
                </Flex>
                <Flex :padding="2" :gap="1" y-align="flex-start" class="flex-1">
                    <NuxtPage />
                </Flex>
            </Flex>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })
</script>

<style lang="sass" scoped></style>
