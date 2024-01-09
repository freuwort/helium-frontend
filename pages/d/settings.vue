<template>
    <NuxtLayout name="auth-default" title="Einstellungen">
        <div class="limiter">
            <Card>
                <Flex horizontal y-align="stretch">
                    <Flex padding="1rem 0" y-align="flex-start" class="w-18 border-right-soft">
                        <ContextMenuLabel label="Account"/>
                        <ContextMenuItem icon="person" label="Profil"/>
                        <ContextMenuItem icon="settings" label="Allgemein"/>
                        <ContextMenuLabel label="Domain" class="margin-top-1"/>
                        <ContextMenuItem icon="store" label="Allgemein"/>
                        <ContextMenuItem icon="group" label="Nutzer"/>
                        <ContextMenuItem icon="palette" label="Design"/>
                        <ContextMenuItem icon="gavel" label="Rechtliches"/>
                    </Flex>
                    <Flex :padding="1" y-align="flex-start" class="flex-1">
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
