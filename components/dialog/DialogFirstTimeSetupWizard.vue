<template>
    <div class="fts-wizard" :class="{ 'open': isOpen }">
        <div class="background"></div>
        <div class="inner">
            <div class="sidebar">
                <AppLogo />
                <h2>Die ersten Schritte<br> zu Ihrer Helium Cloud</h2>
                <p>Lassen Sie uns starten,<br>Ihre Helium Cloud einzurichten!</p>
                <p class="!mt-2">Alle Einstellungen lassen<br>sich später noch ändern.</p>
                <HeSpacer />
                <small class="flex items-center h-14 py-2">
                    <NuxtLink to="https://docs.helium.cloud/de/first-time-setup" target="_blank">Hilfe</NuxtLink><HeSpacer /><span>v2.0.0</span>
                </small>
            </div>


            <div class="content">
                <TransitionGroup :name="'slide-'+direction">
                    <div class="page" v-if="page === 0">
                        <div class="main small-scrollbar">
                            <div class="h-full flex flex-col justify-center items-center gap-4">
                                <img class="h-72" src="/images/app/illustrations/onboarding.svg" alt="Onboarding Illustration">
                                <h4 class="text-blue-600 font-medium">Einrichtung starten</h4>
                            </div>
                        </div>

                        <div class="footer">
                            <IodButton type="button" label="Setup abbrechen" variant="text" corner="pill" v-tooltip="'Das Setup wird dauerhaft geschlossen und Sie können Helium manuell einrichten'" @click="submitDismiss()" />
                            <HeSpacer />
                            <IodButton type="button" class="w-56" label="Starten" variant="filled" corner="pill" @click="setPage(1)" />
                        </div>
                    </div>

                    <form class="page" v-if="page === 1" @submit.prevent="submitDomainSettings">
                        <div class="header">
                            <h3>Ihre Organisation</h3>
                            <small class="px-2">Schritt <b>1</b> von <b>4</b></small>
                        </div>

                        <div class="main small-scrollbar">
                            <div class="flex flex-col gap-4">
                                <ProfileImage class="h-32 mx-auto bg-background-soft" aspect="2" alt="Firmen Logo" tooltip="Logo hochladen" allow-upload :src="domain.settings.company_logo" :loading="logoProcessing" @upload="logoInput.click()"/>
                                <input type="file" class="hidden" ref="logoInput" pattern="image/*" @change="submitDomainLogo(($event.target as any).files[0])">
                                <IodInput label="Anzeigename" v-model="domainForm.company_name"/>
                                <IodInput label="Eingetragener Name" v-model="domainForm.company_legalname"/>
                                <IodInput label="Slogan oder Claim" v-model="domainForm.company_slogan"/>
                            </div>
                        </div>

                        <div class="footer">
                            <HeSpacer />
                            <IodButton type="submit" class="w-56" label="Speichern" variant="filled" corner="pill" :disabled="!isDomainSettingsValid" :loading="domainForm.processing" />
                        </div>
                    </form>

                    <form class="page" v-if="page === 2" @submit.prevent="submitRoles">
                        <div class="header">
                            <h3>Standard Rollen anlegen</h3>
                            <small class="px-2">Schritt <b>2</b> von <b>4</b></small>
                        </div>

                        <div class="main small-scrollbar">
                            <div class="flex flex-col gap-6 mr-1">
                                <div class="flex flex-col gap-2">
                                    <span>Pflichtrollen – {{ requiredRoles.length }}</span>
                                    <ProfileChip
                                        is="button"
                                        type="button"
                                        class="h-12 py-2 border border-solid border-blue-500 bg-blue-100"
                                        v-for="role in requiredRoles"
                                        :title="role.name"
                                        :subtitle="role.permissions.join(', ')"
                                        :icon="role.icon"
                                        :color="role.color"
                                    />
                                </div>
                                    
                                <div class="flex flex-col gap-2">
                                    <span>Optionale Rollen – {{ selectedRoles.length }}</span>
                                    <ProfileChip
                                        is="button"
                                        type="button"
                                        class="h-12 py-2 border border-solid border-slate-400 bg-slate-100"
                                        v-for="role in optionalRoles"
                                        :title="role.name"
                                        :subtitle="role.permissions.join(', ') || 'Keine Berechtigungen'"
                                        :icon="role.icon"
                                        :color="role.color"
                                        :class="{ '!bg-blue-100 !border-blue-500 ml-4': selectedRoles.includes(role.name) }"
                                        @click="toggleRole(role.name)"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="footer">
                            <HeSpacer />
                            <IodButton type="submit" class="w-56" :label="'Rollen anlegen ('+ roles.length +')'" variant="filled" corner="pill" :loading="rolesForm.processing"/>
                        </div>
                    </form>

                    <div class="page" v-if="page === 3">
                        <div class="header">
                            <h3>Benutzer importieren</h3>
                            <small class="px-2">Schritt <b>3</b> von <b>4</b></small>
                        </div>

                        <div class="main small-scrollbar">
                            <div class="w-full h-full flex items-center justify-center">
                                <DialogCsvImport ref="importPopup" :fields="importFields" @import="submitUserImport" />
                                <IodButton type="button" label="Benutzer importieren" variant="filled" corner="pill" size="l" :loading="importForm.processing" @click="importPopup.select()" />
                            </div>
                        </div>

                        <div class="footer">
                            <HeSpacer />
                            <IodButton type="button" class="w-56" label="Überspingen" variant="contained" corner="pill" :loading="importForm.processing" @click="skipUserImport" />
                        </div>
                    </div>

                    <div class="page" v-if="page === 4">
                        <div class="header">
                            <h3>Administratoren auswählen</h3>
                            <small class="px-2">Schritt <b>4</b> von <b>4</b></small>
                        </div>
                        
                        <div class="main">
                            <div class="flex flex-col gap-4 w-full h-full">
                                <IodInput label="Nutzer suchen" v-model="adminSearch"/>
                                <div class="flex gap-2 flex-wrap" v-if="!!adminSelection.length">
                                    <IodButton type="button" class="!normal-case !px-4" v-for="user in adminSelection" :label="(user.name as string)" size="xs" corner="pill" variant="contained" @click="deselectAdmin(user)" v-tooltip="'Abwählen'"/>
                                </div>
                                <div class="flex flex-col flex-1 overflow-y-auto small-scrollbar" v-if="!!adminResults.length && !!adminSearch">
                                    <ProfileChip is="div" class="h-12 !p-2" v-for="user in adminResults" :title="(user.name as string)" :subtitle="(user.username as string)" :image="(user.avatar as string)" @click="selectAdmin(user)">
                                        <div class="flex items-center gap-1">
                                            <IodButton type="button" size="s" corner="pill" label="auswählen" variant="contained" @click.stop="selectAdmin(user)"/>
                                        </div>
                                    </ProfileChip>
                                </div>
                                <IodAlert as="placeholder" class="h-40" v-else-if="!adminResults.length && !!adminSearch">
                                    <span>Keine Ergebnisse für "{{ adminSearch }}"</span>
                                </IodAlert>
                                <IodAlert as="placeholder" class="h-40" v-else>
                                    <span>Suche nach Nutzern um Administratoren auszuwählen</span>
                                </IodAlert>
                            </div>
                        </div>

                        <div class="footer">
                            <HeSpacer />
                            <IodButton type="submit" class="w-56" label="Auswahl bestätigen" variant="filled" corner="pill" @click="submitAdminSelection" v-if="!!adminSelection.length"/>
                            <IodButton type="button" class="w-56" label="Überspringen" variant="contained" corner="pill" @click="skipAdminSelection" v-else/>
                        </div>
                    </div>

                    <div class="page" v-if="page === 5">
                        <div class="main small-scrollbar">
                            <div class="h-full flex flex-col justify-center items-center gap-4">
                                <img class="h-72" src="/images/app/illustrations/done.svg" alt="Success Illustration">
                                <h4 class="text-green-600 font-medium">Alles fertig!</h4>
                            </div>
                        </div>

                        <div class="footer">
                            <HeSpacer />
                            <IodButton type="button" class="w-56" label="Fertig" variant="filled" corner="pill" @click="submitFinish()" />
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { FieldGroup, Field } from '~/classes/import/CsvImport'
    import type { BasicUser } from '~/types/user'

    const domain = useDomainStore()

    const isOpen = ref(false)
    const page = ref(0)
    const direction = ref('')

    function setPage(p: number) {
        // Limit
        if (p > 5 || p < 0) return

        // Skip steps if already completed
        if (p == 1 && domain.settings.setup_completed_domain_basics) return setPage(2)
        if (p == 2 && domain.settings.setup_completed_role_import) return setPage(3)
        if (p == 3 && domain.settings.setup_completed_user_import) return setPage(4)
        if (p == 4 && domain.settings.setup_completed_admin_selection) return setPage(5)

        // Set page
        direction.value = page.value < p ? 'forwards' : 'backwards'
        page.value = p
    }

    function open() {
        isOpen.value = true
        setPage(0)
    }

    function close() {
        isOpen.value = false
    }

    defineExpose({ open, close })



    // START: Dismiss step
    async function submitDismiss() {
        close()
        await domain.patchSettings('setup_dismissed', true)
        await domain.fetchSettings()
    }



    // START: Domain logo step
    const logoInput = ref()
    const logoProcessing = ref(false)

    async function submitDomainLogo(file: any) {
        if (!file) return

        logoProcessing.value = true
        await useAxios().postForm('/api/settings/logo', {file})
        await domain.patchSettings('setup_completed_domain_logo', true)
        await domain.fetchSettings()
        logoInput.value.value = null
        logoProcessing.value = false
    }
    // END: Domain logo step



    // START: Domain step
    const domainForm = useForm({
        company_name: domain?.settings?.company_name ?? '',
        company_legalname: domain?.settings?.company_legalname ?? '',
        company_slogan: domain?.settings?.company_slogan ?? '',
    })

    function isDomainSettingsValid() {
        return !!domainForm.company_name && !!domainForm.company_legalname
    }
    
    async function submitDomainSettings() {
        domainForm.patch('/api/settings', {
            async onSuccess() {
                setPage(2)
                await domain.patchSettings('setup_completed_domain_basics', true)
                await domain.fetchSettings()
            }
        })
    }
    // END: Domain step



    // START: Roles step
    const requiredRoles = ref([
        {name: 'Admin', icon: 'shield', color: '#3b82f6', permissions: ['system.admin']},
    ])

    const optionalRoles = ref([
        {name: 'Kunde', icon: 'shopping_cart', color: '#3b82f6', permissions: []},
        {name: 'Lieferant', icon: 'shopping_cart', color: '#3b82f6', permissions: []},
        {name: 'Personal', icon: 'work', color: '#3b82f6', permissions: []},
        {name: 'Buchhaltung', icon: 'work', color: '#3b82f6', permissions: []},
        {name: 'Verwaltung', icon: 'work', color: '#3b82f6', permissions: []},
        {name: 'Einkauf', icon: 'work', color: '#3b82f6', permissions: []},
        {name: 'Vertrieb', icon: 'work', color: '#3b82f6', permissions: []},
        {name: 'Support', icon: 'work', color: '#3b82f6', permissions: []},
        {name: 'Logistik', icon: 'work', color: '#3b82f6', permissions: []},
    ])

    const selectedRoles = ref([] as string[])

    function toggleRole(role: string) {
        if (selectedRoles.value.includes(role)) {
            selectedRoles.value = selectedRoles.value.filter(r => r !== role)
        }
        else {
            selectedRoles.value.push(role)
        }
    }

    const roles = computed(() => [...requiredRoles.value, ...optionalRoles.value.filter(r => selectedRoles.value.includes(r.name))])
    const rolesForm = useForm({
        items: [],
    })

    async function submitRoles() {
        rolesForm
        .transform((data) => {
            return {items: roles.value}
        })
        .post('/api/roles/import', {
            async onSuccess() {
                setPage(3)
                await domain.patchSettings('setup_completed_role_import', true)
                await domain.fetchSettings()
            }
        })
    }
    // END: Roles step



    // START: Import step
    const importForm = useForm({ items: [] })
    const importPopup = ref()
    const importFields = ref([
        new FieldGroup('Allgemeines', [
            new Field('username', 'Nutzername'),
            new Field('email', 'Email'),
            new Field('password', 'Passwort'),
            new Field('roles', 'Rollen'),
        ]),
        new FieldGroup('Vollständiger Name', [
            new Field('user_name_salutation', 'Anrede'),
            new Field('user_name_prefix', 'Titel'),
            new Field('user_name_firstname', 'Vorname'),
            new Field('user_name_middlename', 'Zweiter Vorname'),
            new Field('user_name_lastname', 'Nachname'),
            new Field('user_name_suffix', 'Suffix'),
            new Field('user_name_legalname', 'Rechtlicher Name'),
            new Field('user_name_nickname', 'Spitzname'),
        ]),
        new FieldGroup('Organisation', [
            new Field('user_company_company', 'Organisation'),
            new Field('user_company_department', 'Abteilung'),
            new Field('user_company_title', 'Position'),
        ]),
    ])

    async function submitUserImport(data: any[])
    {
        importForm
        .transform((_) => {
            return {items: data}
        })
        .post('/api/users/import', {
            async onSuccess() {
                setPage(4)
                await domain.patchSettings('setup_completed_user_import', true)
                await domain.fetchSettings()
            }
        })
    }

    async function skipUserImport()
    {
        setPage(4)
        await domain.patchSettings('setup_completed_user_import', false)
        await domain.fetchSettings()
    }
    // END: Import step



    // START: Select admins step
    const adminSearch = ref('')
    const adminResults = ref<BasicUser[]>([])
    const adminSelection = ref<BasicUser[]>([])

    watch(adminSearch, search)

    async function search() {
        if (!adminSearch.value) return
        
        let userResponse = await useAxios().get(apiRoute('/api/users/basic', {
            filter: { search: adminSearch.value, exclude: adminSelection.value.map((e: any) => e.id) },
            size: 20,
        }))
        
        adminResults.value = userResponse.data.data
    }

    function selectAdmin(user: BasicUser) {
        if (adminSelection.value.includes(user)) return
        
        adminSelection.value.push(user)
    }

    function deselectAdmin(user: BasicUser) {
        adminSelection.value = adminSelection.value.filter(u => u.id !== user.id)
    }

    async function submitAdminSelection() {
        
    }

    async function skipAdminSelection() {
        setPage(5)
        await domain.patchSettings('setup_completed_admin_selection', false)
        await domain.fetchSettings()
    }
    // END: Select admins step



    // START: Finish step
    async function submitFinish() {
        close()
        await domain.patchSettings('setup_completed', true)
        await domain.fetchSettings()
    }
    // END: Finish step
</script>

<style lang="sass" scoped>
    .slide-forwards-enter-active,
    .slide-backwards-enter-active,
    .slide-forwards-leave-active,
    .slide-backwards-leave-active
        transition: all 300ms ease

    .slide-forwards-enter-from,
    .slide-backwards-leave-to
        transform: translateX(50%)
        opacity: 0

    .slide-forwards-leave-to,
    .slide-backwards-enter-from
        transform: translateX(-50%)
        opacity: 0

    .fts-wizard
        position: fixed
        top: 0
        bottom: 0
        left: 0
        right: 0
        z-index: 1010
        display: flex
        align-items: center
        justify-content: center
        pointer-events: none

        &.open
            pointer-events: all

            .background
                opacity: 1

            .inner
                transform: translateY(0)
                opacity: 1

        .background
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            background: #00000099
            backdrop-filter: blur(20px)
            transition: opacity 300ms ease
            opacity: 0

        .inner
            position: relative
            z-index: 1
            display: flex
            width: calc(100% - 2rem)
            max-width: 900px
            height: calc(100% - 2rem)
            max-height: 600px
            background: var(--color-background)
            border-radius: var(--radius-xl)
            box-shadow: 0 0 0 5px var(--color-background), var(--shadow-l)
            transform: translateY(4rem)
            opacity: 0
            transition: all 300ms ease

            .sidebar
                display: flex
                flex-direction: column
                padding-inline: 1.5rem
                width: 320px
                border-radius: inherit
                background-color: var(--color-text)
                background-image: url('/images/app/banner_pattern_light.png')
                background-size: 333% auto
                background-position: center 0
                color: var(--color-background-soft)

                > svg
                    height: 2.5rem
                    width: 2.5rem
                    margin-block: 1.5rem
                    margin-right: auto
                    color: var(--color-background)

                > h2
                    color: var(--color-background)
                    font-size: 1.5rem
                    font-weight: 500
                    margin: .75rem 0

                > p
                    margin: 0

                > small a
                    color: inherit

                > small a:hover
                    color: var(--color-background)
            
            .content
                flex: 1
                display: flex
                border-radius: inherit
                position: relative
                overflow: hidden

                .page
                    position: absolute
                    top: 0
                    bottom: 0
                    left: 0
                    right: 0
                    display: grid
                    grid-template-rows: auto 1fr 3.5rem
                    grid-template-areas: 'header' 'main' 'footer'
                    padding-inline: 1.5rem
                    border-radius: inherit

                    .header
                        grid-area: header
                        height: 5.5rem
                        display: flex
                        align-items: center
                        padding-block: 1.5rem

                        > h3
                            flex: 1
                            font-size: 1.25rem
                            font-weight: 500
                            margin: 0

                    .main
                        grid-area: main
                        overflow-y: auto

                    .footer
                        grid-area: footer
                        display: flex
                        align-items: center
                        justify-content: space-between
                        padding-block: .5rem
</style>