<template>
    <header>
        <HeFlex horizontal class="main-bar">
            <AppHeaderItem :is="NuxtLink" to="/d">
                <img class="h-8" src="/images/app/logo.svg" alt="logo" />
            </AppHeaderItem>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#6366F1" icon="home"/>

                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d" show-chevron color="#6366F1 " icon="home">Startseite</ContextMenuItem>
                        <ContextMenuItem to="/d/users" show-chevron color="#3B82F6" icon="group">Nutzer</ContextMenuItem>
                        <ContextMenuItem to="/d/media" show-chevron color="#0EA5E9" icon="folder">Dateien</ContextMenuItem>
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
                <AppHeaderItem show-chevron color="#3B82F6" icon="group"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/users" show-chevron color="#3B82F6" icon="group">Alle Nutzer</ContextMenuItem>
                        <ContextMenuItem to="/d/users/editor" color="#3B82F6" icon="person_add">Nutzer erstellen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/companies" show-chevron color="#3B82F6" icon="store">Alle Unternehmen</ContextMenuItem>
                        <ContextMenuItem to="/d/companies/editor" color="#3B82F6" icon="add_business">Unternehmen erstellen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/roles" show-chevron color="#3B82F6" icon="badge">Berechtigungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#0EA5E9" icon="folder"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/media" show-chevron color="#0EA5E9" icon="folder">Alle Dateien</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#06B6D4" icon="edit_square"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/forms" show-chevron color="#06B6D4" icon="edit_square">Alle Formulare</ContextMenuItem>
                        <ContextMenuItem to="/d/forms/editor" color="#06B6D4" icon="add_circle">Formular erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#10b981" icon="confirmation_number"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/events" show-chevron color="#10b981" icon="confirmation_number">Alle Events</ContextMenuItem>
                        <ContextMenuItem to="/d/events/editor" color="#10b981" icon="add_circle">Event erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#84cc16" icon="desktop_windows"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/screens" show-chevron color="#84cc16" icon="desktop_windows">Alle Screens</ContextMenuItem>
                        <ContextMenuItem to="/d/screens/editor" color="#84cc16" icon="add_circle">Screen erstellen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#F59E0B" icon="note_stack"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/screens" show-chevron color="#F59E0B" icon="news">Posts</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/screens" show-chevron color="#F59E0B" icon="data_array">Spaces</ContextMenuItem>
                        <ContextMenuItem to="/d/screens" show-chevron color="#F59E0B" icon="label">Kategorien</ContextMenuItem>
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
            </VDropdown> -->
            
            <HeSpacer />

            <!-- <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron icon="notifications"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron icon="inbox">Alle Benachrichtigungen</ContextMenuItem>
                        <ContextMenuDivider />
                    </ContextMenu>
                </template>
            </VDropdown> -->
            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <ProfileChip v-if="auth.user" :title="auth.user.name ?? auth.user.fullname ?? ''" :subtitle="auth.user.username ?? ''" :image="auth.user.profile_image" align="right"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/profile" show-chevron icon="person">Profil</ContextMenuItem>
                        <ContextMenuItem to="/d/settings/personal" show-chevron icon="manage_accounts">Profil Einstellungen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/settings" show-chevron icon="settings">Domain Verwaltung</ContextMenuItem>
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
