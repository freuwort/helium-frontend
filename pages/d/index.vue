<template>
    <NuxtLayout name="auth-default" title="Startseite" color="var(--color-primary)">
        <div class="limiter">
            <Card>
                <Flex :gap="1" :padding="1">
                    <ContextMenu>
                        <ContextMenuItem show-chevron color="var(--color-primary)" icon="dashboard">Startseite</ContextMenuItem>
                        <ContextMenuItem show-chevron color="var(--color-primary)" icon="drive_folder_upload">Dateien</ContextMenuItem>
                        <ContextMenuItem show-chevron color="var(--color-primary)" icon="group">Nutzer</ContextMenuItem>
                        <ContextMenuItem to="/d/settings" show-chevron color="var(--color-primary)" icon="settings">Einstellungen</ContextMenuItem>
                    </ContextMenu>
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

<style scoped></style>
