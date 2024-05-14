<template>
    <header>
        <HeFlex horizontal class="main-bar">
            <AppHeaderItem :is="NuxtLink" to="/d">
                <img class="h-8" src="/images/app/logo.svg" alt="logo" />
            </AppHeaderItem>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="var(--color-primary)" icon="home"/>

                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d" show-chevron color="var(--color-primary)" icon="home">Startseite</ContextMenuItem>
                        <ContextMenuItem to="/d/users" show-chevron color="var(--color-primary)" icon="group">Nutzer</ContextMenuItem>
                        <ContextMenuItem to="/d/files" show-chevron color="var(--color-primary)" icon="folder">Dateien</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem show-chevron color="#9747FF" icon="package_2">Produkte</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF4757" icon="receipt">Rechnungen / Angebote</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF6348" icon="warehouse">Lagerverwaltung</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FFA502" icon="local_mall">Onlineshop</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#20bf6b" icon="edit_square">Inhalte</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#0fb9b1" icon="local_library">Wiki</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/settings/" show-chevron icon="settings">Einstellungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="var(--color-primary)" icon="group"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
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
                <AppHeaderItem show-chevron color="var(--color-primary)" icon="folder"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/files" show-chevron color="var(--color-primary)" icon="folder">Alle Dateien</ContextMenuItem>
                        <ContextMenuItem to="/d/files" color="var(--color-primary)" icon="drive_folder_upload">Dateien hochladen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            
            <!-- <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#9747FF" icon="package_2"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#9747FF" icon="package_2">Alle Produkte</ContextMenuItem>
                        <ContextMenuItem color="#9747FF" icon="add_circle">Produkt erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FF4757" icon="receipt"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
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
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#FF6348" icon="warehouse">Alle Lager</ContextMenuItem>
                        <ContextMenuItem color="#FF6348" icon="add_circle">Lager erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FFA502" icon="local_mall"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#FFA502" icon="local_mall">Shop Einrichten</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#20bf6b" icon="edit_square"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#20bf6b" icon="category">Alle Kategorien</ContextMenuItem>
                        <ContextMenuItem color="#20bf6b" icon="add_circle">Kategorie erstellen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem show-chevron color="#20bf6b" icon="label">Alle Tags</ContextMenuItem>
                        <ContextMenuItem color="#20bf6b" icon="add_circle">Tag erstellen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem show-chevron color="#20bf6b" icon="notes">Alle Inhalte</ContextMenuItem>
                        <ContextMenuItem color="#20bf6b" icon="add_circle">Inhalt erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#0fb9b1" icon="local_library"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#0fb9b1" icon="local_library">Wiki Einrichten</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown> -->
            
            <HeSpacer />

            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron icon="notifications"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron icon="inbox">Alle Benachrichtigungen</ContextMenuItem>
                        <ContextMenuDivider />
                    </ContextMenu>
                </template>
            </VDropdown>
            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <ProfileChip v-if="auth.user" :title="auth.user.name ?? auth.user.fullname ?? ''" :subtitle="auth.user.username ?? ''" :image="auth.user.profile_image" align="right"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/profile" show-chevron icon="person">Profil</ContextMenuItem>
                        <ContextMenuItem to="/d/settings/personal" show-chevron icon="settings">Konto</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem is="button" show-chevron color="var(--color-error)" icon="logout" @click="auth.logout()">Abmelden</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
        </HeFlex>
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
        box-shadow: var(--shadow-s)

        .profile-chip
            height: 3rem
            padding-block: .5rem
            margin-inline: .5rem
</style>
