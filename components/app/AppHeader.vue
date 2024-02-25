<template>
    <header>
        <Flex horizontal class="main-bar">
            <AppHeaderItem :is="NuxtLink" to="/d">
                <img class="h-2" src="/images/app/logo.svg" alt="logo" />
            </AppHeaderItem>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="var(--color-primary)" icon="home"/>

                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem to="/d" show-chevron color="var(--color-primary)" icon="dashboard">Startseite</ContextMenuItem>
                        <ContextMenuItem to="/d/files" show-chevron color="var(--color-primary)" icon="folder">Dateien</ContextMenuItem>
                        <ContextMenuItem to="/d/users" show-chevron color="var(--color-primary)" icon="group">Nutzer</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem show-chevron color="#9747FF" icon="package_2">Produkte</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF4757" icon="receipt">Rechnungen / Angebote</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF6348" icon="warehouse">Lagerverwaltung</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FFA502" icon="local_mall">Onlineshop</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/settings/" show-chevron icon="settings">Einstellungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="var(--color-primary)" icon="folder"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem to="/d/files" show-chevron color="var(--color-primary)" icon="folder">Alle Dateien</ContextMenuItem>
                        <ContextMenuItem to="/d/files" color="var(--color-primary)" icon="drive_folder_upload">Dateien hochladen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="var(--color-primary)" icon="group"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem to="/d/users" show-chevron color="var(--color-primary)" icon="group">Alle Nutzer</ContextMenuItem>
                        <ContextMenuItem to="/d/users/editor" color="var(--color-primary)" icon="person_add">Nutzer erstellen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/companies" show-chevron color="var(--color-primary)" icon="store">Alle Unternehmen</ContextMenuItem>
                        <ContextMenuItem to="/d/companies/editor" color="var(--color-primary)" icon="add_business">Unternehmen erstellen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/roles" show-chevron color="var(--color-primary)" icon="badge">Berechtigungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#9747FF" icon="package_2"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem show-chevron color="#9747FF" icon="package_2">Alle Produkte</ContextMenuItem>
                        <ContextMenuItem color="#9747FF" icon="add_circle">Produkt erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FF4757" icon="receipt"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem show-chevron color="#FF4757" icon="article">Alle Angebote</ContextMenuItem>
                        <ContextMenuItem color="#FF4757" icon="post_add">Angebot erstellen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem show-chevron color="#FF4757" icon="receipt">Alle Rechnungen</ContextMenuItem>
                        <ContextMenuItem color="#FF4757" icon="add_circle">Rechnung erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FF6348" icon="warehouse"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem show-chevron color="#FF6348" icon="warehouse">Alle Lager</ContextMenuItem>
                        <ContextMenuItem color="#FF6348" icon="add_circle">Lager erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FFA502" icon="local_mall"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem show-chevron color="#FFA502" icon="local_mall">Shop Einrichten</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            
            <Spacer />

            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron icon="notifications"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem show-chevron icon="inbox">Alle Benachrichtigungen</ContextMenuItem>
                        <ContextMenuDivider />
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <ProfileChip :user="auth.user ?? {}" show-company align="right" class="min-h-4"/>
                <template #popper>
                    <ContextMenu class="min-w-20">
                        <ContextMenuItem to="/d/profile" show-chevron icon="person">Profil</ContextMenuItem>
                        <ContextMenuItem to="/d/settings/personal" show-chevron icon="settings">Konto</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem is="button" show-chevron color="var(--color-red)" icon="logout" @click="auth.logout()">Abmelden</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
        </Flex>
    </header>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const NuxtLink = defineNuxtLink({})
</script>

<style lang="sass" scoped>
    header
        width: 100%

    .main-bar
        background-color: var(--color-background)
        border-bottom: 1px solid var(--color-background-soft)
        box-shadow: var(--shadow-elevation-low)
</style>
