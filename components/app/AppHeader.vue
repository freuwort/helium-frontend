<template>
    <header>
        <div class="aria-left flex items-stretch pl-4 h-full">
            <AppHeaderItem :is="NuxtLink" to="/" icon="home" v-tooltip="'Übersicht'" />

            <HeDivider vertical class="self-center h-8 mx-4"/>

            <AppHeaderItem :is="NuxtLink" to="/users" route-group="/users" icon="identity_platform" v-tooltip="'Nutzer'" v-if="auth.can('system.view.users')"/>
            <AppHeaderItem :is="NuxtLink" to="/roles" route-group="/roles" icon="shield" v-tooltip="'Berechtigungen'" v-if="auth.can('system.view.roles')"/>
            <AppHeaderItem :is="NuxtLink" to="/devices" route-group="/devices" icon="devices" v-tooltip="'Geräte'" v-if="auth.can('system.view.devices')"/>
            <AppHeaderItem :is="NuxtLink" to="/media/domain" route-group="/media" icon="folder" v-tooltip="'Dateien'" v-if="auth.can('system.access.media')"/>
            
            <HeDivider vertical class="self-center h-8 mx-4"/>

            <AppHeaderItem :is="NuxtLink" to="/forms" route-group="/forms" icon="send" v-tooltip="'Formulare'" v-if="auth.can('app.view.forms')"/>
            <AppHeaderItem :is="NuxtLink" to="/screens" route-group="/screens" icon="tv" v-tooltip="'Bildschirme'" v-if="auth.can('app.view.screens')"/>

            <!-- <VDropdown placement="bottom-start" :skidding="-8" :distance="-1" v-if="devMode">
                <AppHeaderItem show-chevron color="#06B6D4" icon="edit_square" v-tooltip="'Formulare'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/forms" show-chevron color="#06B6D4" icon="edit_square">Formulare</ContextMenuItem>
                        <ContextMenuItem to="/forms/submissions" show-chevron color="#06B6D4" icon="inbox">Einsendungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1" v-if="devMode">
                <AppHeaderItem show-chevron color="#10b981" icon="confirmation_number" v-tooltip="'Events'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/events" show-chevron color="#10b981" icon="confirmation_number">Events</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1" v-if="devMode">
                <AppHeaderItem show-chevron color="#84cc16" icon="desktop_windows" v-tooltip="'Screens'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/screens/devices" show-chevron color="#84cc16" icon="desktop_windows">Geräte</ContextMenuItem>
                        <ContextMenuItem to="/screens/playlists" show-chevron color="#84cc16" icon="playlist_play">Playlists</ContextMenuItem>
                        <ContextMenuItem to="/screens/screens" show-chevron color="#84cc16" icon="slideshow">Screens</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1" v-if="devMode">
                <AppHeaderItem show-chevron color="#F59E0B" icon="note_stack" v-tooltip="'Inhalte'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/content/posts" show-chevron color="#F59E0B" icon="news">Beträge</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/content/spaces" show-chevron color="#F59E0B" icon="data_array">Spaces</ContextMenuItem>
                        <ContextMenuItem to="/content/categories" show-chevron color="#F59E0B" icon="label">Kategorien</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
            
            <VDropdown placement="bottom-start" :skidding="-8" :distance="-1" v-if="devMode">
                <AppHeaderItem show-chevron color="#FF6348" icon="package_2" v-tooltip="'Produkte'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem show-chevron color="#FF6348" icon="package_2">Produkte</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown> -->

            <!-- <VDropdown placement="bottom-start" :skidding="-8" :distance="-1">
                <AppHeaderItem show-chevron color="#FF4757" icon="receipt" v-tooltip="'Buchhaltung'"/>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <ContextMenuItem to="/accounting/contacts" show-chevron color="#FF4757" icon="domain">Kontakte</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem show-chevron color="#FF4757" icon="article">Angebote</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF4757" icon="home_repair_service">Aufträge</ContextMenuItem>
                        <ContextMenuItem show-chevron color="#FF4757" icon="receipt">Rechnungen</ContextMenuItem>
                        <ContextMenuDivider />
                        <ContextMenuItem show-chevron color="#FF4757" icon="credit_card_off">Rückerstattungen</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown> -->

            <HeSpacer />
        </div>

        <div class="aria-center flex items-stretch px-4 h-full">
            <div class="branding">
                <AppLogo />
                <h2 aria-label="Branding: Helium">HELIUM</h2>
            </div>
        </div>

        <div class="aria-right flex items-stretch pr-4 h-full">
            <HeSpacer />

            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <AppHeaderItem icon="upload" :badge="uploadManager.status.uploading || null" v-tooltip="`Uploads – ${uploadManager.statusText || 'Keine Uploads'}`"/>
                <template #popper>
                    <MediaUploadCard class="min-w-[26rem]"/>
                </template>
            </VDropdown>

            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <AppHeaderItem icon="notifications" :badge="notifications.unread.length ?? null" v-tooltip="'Benachrichtigungen'"/>
                <template #popper>
                    <NotificationCenter class="min-w-[26rem]"/>
                </template>
            </VDropdown>

            <AppHeaderItem :is="NuxtLink" to="/settings" route-group="/settings" icon="settings" v-tooltip="'Domain Einstellungen'" v-if="auth.can('system.admin')"/>

            <HeDivider vertical class="self-center h-8 mx-4"/>

            <VDropdown placement="bottom-end" :skidding="-8" :distance="-1">
                <AppHeaderItem icon="settings" v-tooltip="'Ihr Profil'">
                    <ProfileImage class="h-8 !rounded-full" :src="auth.user.avatar" />
                </AppHeaderItem>
                <template #popper>
                    <ContextMenu class="min-w-80">
                        <div class="flex gap-2 px-2">
                            <IodIconButton
                                class="flex-1"
                                corner="m"
                                size="s"
                                :variant="theme === 'light'? 'contained' : 'text'"
                                :color-preset="theme === 'light' ? 'info' : 'text'"
                                icon="light_mode"
                                v-tooltip="'Theme: Hell'"
                                @click="auth.setSettings('ui_theme', 'light', 'db')"
                            />
                            <IodIconButton
                                class="flex-1"
                                corner="m"
                                size="s"
                                :variant="theme === 'dark'? 'contained' : 'text'"
                                :color-preset="theme === 'dark' ? 'info' : 'text'"
                                icon="dark_mode"
                                v-tooltip="'Theme: Dunkel'"
                                @click="auth.setSettings('ui_theme', 'dark', 'db')"
                            />
                            <IodIconButton
                                class="flex-1"
                                corner="m"
                                size="s"
                                :variant="theme === 'system'? 'contained' : 'text'"
                                :color-preset="theme === 'system' ? 'info' : 'text'"
                                icon="contrast"
                                v-tooltip="'Theme: System'"
                                @click="auth.setSettings('ui_theme', 'system', 'db')"
                            />
                        </div>
                        <ContextMenuDivider />
                        <ContextMenuItem to="/auth/profile" show-chevron icon="person">Profil</ContextMenuItem>
                        <ContextMenuItem is="button" show-chevron color="var(--color-error)" icon="logout" @click="auth.logout()">Abmelden</ContextMenuItem>
                    </ContextMenu>
                </template>
            </VDropdown>
        </div>
    </header>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const devMode = useDevMode()
    const NuxtLink = defineNuxtLink({})
    const uploadManager = useUploadStore()
    const notifications = useNotificationStore()
    
    const theme = computed(() => {
        return auth.user?.settings.ui_theme ?? 'system'
    })
</script>

<style lang="sass" scoped>
    header
        display: grid
        grid-template-columns: 1fr auto 1fr
        grid-template-areas: "left center right"
        height: 100%

        .aria-left
            grid-area: left
            justify-content: start

        .aria-center
            grid-area: center
            justify-content: center

        .aria-right
            grid-area: right
            justify-content: end

        .branding
            align-self: center
            display: flex
            align-items: center
            height: 1rem
            gap: .5rem
            user-select: none
            pointer-events: none
            color: var(--color-text-soft)
            opacity: .5

            svg
                height: 1.25rem
                width: 1.25rem

            h2
                margin: 0
                font-weight: 700
                font-size: .875rem
                letter-spacing: .05rem
                color: inherit
</style>
