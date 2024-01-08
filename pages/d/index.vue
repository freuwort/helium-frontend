<template>
    <div class="limiter">
        <Card @submit.prevent>
            <Layout :gap="1" :padding="1">
                <ContextMenu>
                    <ContextMenuItem show-chevron color="var(--color-primary)" icon="dashboard">Startseite</ContextMenuItem>
                    <ContextMenuItem show-chevron color="var(--color-primary)" icon="drive_folder_upload">Dateien</ContextMenuItem>
                    <ContextMenuItem show-chevron color="var(--color-primary)" icon="group">Nutzer</ContextMenuItem>
                    <ContextMenuItem show-chevron color="var(--color-primary)" icon="settings">Einstellungen</ContextMenuItem>
                </ContextMenu>
            </Layout>
        </Card>
    </div>
</template>

<script lang="ts" setup>
    definePageMeta({
        layout: 'auth-default',
        middleware: 'auth',
    })
    
    useHead({
        title: 'Startseite',
    })
</script>

<style scoped></style>
