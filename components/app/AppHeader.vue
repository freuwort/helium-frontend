<template>
    <header>
        <HeFlex horizontal class="main-bar">
            <VDropdown placement="bottom-start" :distance="-1">
                <AppHeaderItem @dblclick="navigateTo('/d')" v-tooltip="'Home'">
                    <img class="h-8" src="/images/app/logo.svg" alt="logo" />
                </AppHeaderItem>

                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d" show-chevron icon="home">Startseite</ContextMenuItem>
                        <!-- <ContextMenuItem show-chevron icon="location_on">Standorte</ContextMenuItem> -->
                        <ContextMenuItem to="/d/users" show-chevron icon="group">Nutzer</ContextMenuItem>
                        <ContextMenuItem to="/d/media" show-chevron icon="folder">Dateien</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/forms" show-chevron color="#06B6D4" icon="edit_square">Formulare</ContextMenuItem>
                        <ContextMenuItem to="/d/events" show-chevron color="#10b981" icon="confirmation_number">Events</ContextMenuItem>
                        <ContextMenuItem to="/d/screens" show-chevron color="#84cc16" icon="desktop_windows">Screens</ContextMenuItem>
                        <ContextMenuItem to="/d/content" show-chevron color="#F59E0B" icon="note_stack">Inhalte</ContextMenuItem>
                        <!-- <ContextMenuItem show-chevron color="#FF6348" icon="package_2">Produkte</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF4757" icon="receipt">Rechnungen / Angebote</ContextMenuItem> -->
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/settings/" show-chevron icon="settings">Einstellungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <HeDivider vertical class="h-8"/>

            <!-- <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron icon="location_on"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron icon="location_on">Standorte</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown> -->

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron icon="group" v-tooltip="'Nutzer / Unternehmen / Berechtigungen'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/users" show-chevron icon="group">Nutzer</ContextMenuItem>
                        <ContextMenuItem to="/d/companies" show-chevron icon="store">Unternehmen</ContextMenuItem>
                        <ContextMenuItem to="/d/roles" show-chevron icon="badge">Berechtigungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron icon="folder" v-tooltip="'Dateien'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/media/domain" show-chevron icon="home_storage">Hauptspeicher</ContextMenuItem>
                        <ContextMenuItem to="/d/media/profiles" show-chevron icon="switch_account">Profil Dateien</ContextMenuItem>
                        <ContextMenuItem to="/d/media/forms" show-chevron icon="edit_square">Formular Dateien</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <HeDivider vertical class="h-8 ml-2"/>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#06B6D4" icon="edit_square" v-tooltip="'Formulare'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/forms" show-chevron color="#06B6D4" icon="edit_square">Formulare</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#10b981" icon="confirmation_number" v-tooltip="'Events'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/events" show-chevron color="#10b981" icon="confirmation_number">Events</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#84cc16" icon="desktop_windows" v-tooltip="'Screens'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/screens" show-chevron color="#84cc16" icon="desktop_windows">Screens</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <!-- <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#F59E0B" icon="note_stack" v-tooltip="'Inhalte'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/d/content/posts" show-chevron color="#F59E0B" icon="news">Beträge</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/d/content/spaces" show-chevron color="#F59E0B" icon="data_array">Spaces</ContextMenuItem>
                        <ContextMenuItem to="/d/content/categories" show-chevron color="#F59E0B" icon="label">Kategorien</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FF6348" icon="package_2" v-tooltip="'Produkte'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#FF6348" icon="package_2">Produkte</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FF4757" icon="receipt" v-tooltip="'Rechnungen / Angebote'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#FF4757" icon="article">Angebote</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF4757" icon="receipt">Rechnungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown> -->
            
            <HeSpacer />

            <MediaUploadProgress />

            <!-- <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron icon="notifications" v-tooltip="'Benachrichtigungen'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron icon="inbox">Alle Benachrichtigungen</ContextMenuItem>
                        <ContextMenuDivider />
                    </ContextMenu>
                </template>
            </VDropdown> -->

            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <ProfileChip v-if="auth.user" :title="auth.user.name ?? auth.user.fullname ?? ''" :subtitle="auth.user.username ?? ''" :image="auth.user.profile_image" align="right" v-tooltip="'Profil'"/>
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
