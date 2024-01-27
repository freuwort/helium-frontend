<template>
    <NuxtLayout name="auth-default" pageTitle="Startseite" color="var(--color-primary)">
        <Card>
            <Flex :gap="1" :padding="1">
                <ContextMenu>
                    <ContextMenuItem to="/d" show-chevron color="var(--color-primary)" icon="dashboard">Startseite</ContextMenuItem>
                    <ContextMenuItem show-chevron color="var(--color-primary)" icon="drive_folder_upload">Dateien</ContextMenuItem>
                    <ContextMenuItem to="/d/users" show-chevron color="var(--color-primary)" icon="group">Nutzer</ContextMenuItem>
                    <ContextMenuItem to="/d/settings" show-chevron color="var(--color-primary)" icon="settings">Einstellungen</ContextMenuItem>
                </ContextMenu>
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
