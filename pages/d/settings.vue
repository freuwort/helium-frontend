<template>
    <NuxtLayout name="auth-default" pageTitle="Einstellungen" color="#363E40">
        <div class="limiter">
            <Card>
                <Flex horizontal y-align="stretch">
                    <Flex padding="2rem 0" y-align="flex-start" class="w-18 border-right-soft">
                        <ContextMenuLabel label="Konto"/>
                        <ContextMenuItem to="/d/settings/profile" icon="person" label="Profil" :active="useIsRoute('d-settings-profile')"/>
                        <ContextMenuItem to="/d/settings/personal" icon="settings" label="Konto" :active="useIsRoute('d-settings-personal')" />

                        <ContextMenuLabel label="Domain" class="margin-top-1"/>
                        <ContextMenuItem to="/d/settings/" icon="store" label="System" :active="useIsRoute('d-settings')" />
                    </Flex>
                    <Flex :padding="2" :gap="1" y-align="flex-start" class="flex-1">
                        <NuxtPage />
                    </Flex>
                </Flex>
            </Card>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })
</script>

<style lang="sass" scoped></style>
