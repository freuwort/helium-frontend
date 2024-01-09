<template>
    <NuxtLayout name="auth-default" title="Einstellungen">
        <div class="limiter">
            <Card>
                <Flex horizontal y-align="stretch">
                    <Flex padding="2rem 0" y-align="flex-start" class="w-18 border-right-soft">
                        <ContextMenuLabel label="Konto"/>
                        <ContextMenuItem to="/d/settings/profile" icon="person" label="Profil" :active="useCompareRoutes('/d/settings/profile') === 'exact'"/>
                        <ContextMenuItem to="/d/settings/personal" icon="settings" label="Konto" :active="useCompareRoutes('/d/settings/personal') === 'exact'" />

                        <ContextMenuLabel label="Domain" class="margin-top-1"/>
                        <ContextMenuItem to="/d/settings/" icon="store" label="System" :active="useCompareRoutes('/d/settings/') === 'exact'" />
                        <ContextMenuItem to="/d/settings/users" icon="group" label="Nutzer" :active="useCompareRoutes('/d/settings/users') === 'exact'" />
                        <ContextMenuItem to="/d/settings/design" icon="palette" label="Design" :active="useCompareRoutes('/d/settings/design') === 'exact'" />
                        <ContextMenuItem to="/d/settings/legal" icon="gavel" label="Rechtliches" :active="useCompareRoutes('/d/settings/legal') === 'exact'" />
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
    const auth = useAuthStore()

    definePageMeta({
        middleware: 'auth',
    })
</script>

<style lang="sass" scoped></style>
