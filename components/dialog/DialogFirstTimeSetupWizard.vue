<template>
    <div class="fts-wizard" :class="{ 'open': isOpen }">
        <div class="background"></div>
        <div class="inner">
            <div class="sidebar">
                <img src="/images/app/logo_white.svg" alt="Helium Logo">
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
                            <HeSpacer />
                            <IodButton type="button" class="w-40" label="Starten" variant="filled" corner="pill" @click="setPage(1)" />
                        </div>
                    </div>

                    <form class="page" v-if="page === 1" @submit.prevent="submitDomainSettings">
                        <div class="header">
                            <h3>Ihre Organisation</h3>
                            <small class="px-2">Schritt <b>1</b> von <b>4</b></small>
                        </div>

                        <div class="main small-scrollbar">
                            <div class="flex flex-col gap-4">
                                <input type="file" ref="logoInput" pattern="image/*" @change="submitDomainLogo">
                                <IodInput label="Anzeigename" v-model="domainForm.company_name"/>
                                <IodInput label="Eingetragener Name" v-model="domainForm.company_legalname"/>
                                <IodInput label="Slogan oder Claim" v-model="domainForm.company_slogan"/>
                            </div>
                        </div>

                        <div class="footer">
                            <IodButton type="button" class="w-40" label="Zurück" variant="contained" corner="pill" @click="setPage(0)" />
                            <HeSpacer />
                            <IodButton type="submit" class="w-40" label="Weiter" variant="filled" corner="pill" :disabled="!isDomainSettingsValid" :loading="domainForm.processing" />
                        </div>
                    </form>

                    <div class="page" v-if="page === 2">
                        <div class="header">
                            <h3>Standard Benutzergruppen</h3>
                            <small class="px-2">Schritt <b>2</b> von <b>4</b></small>
                        </div>

                        <div class="main small-scrollbar">
                            <div class="flex flex-col gap-4">
                            </div>
                        </div>

                        <div class="footer">
                            <IodButton type="button" class="w-40" label="Zurück" variant="contained" corner="pill" @click="setPage(1)" />
                            <HeSpacer />
                            <IodButton type="button" class="w-40" label="Weiter" variant="filled" corner="pill" @click="setPage(3)" />
                        </div>
                    </div>

                    <div class="page" v-if="page === 3">
                        <div class="header">
                            <h3>Benutzer importieren</h3>
                            <small class="px-2">Schritt <b>3</b> von <b>4</b></small>
                        </div>

                        <div class="main small-scrollbar">
                            <div class="flex flex-col gap-4">
                            </div>
                        </div>

                        <div class="footer">
                            <IodButton type="button" class="w-40" label="Zurück" variant="contained" corner="pill" @click="setPage(2)" />
                            <HeSpacer />
                            <IodButton type="button" class="w-40" label="Weiter" variant="filled" corner="pill" @click="setPage(4)" />
                        </div>
                    </div>

                    <div class="page" v-if="page === 4">
                        <div class="header">
                            <h3>Administratoren auswählen</h3>
                            <small class="px-2">Schritt <b>4</b> von <b>4</b></small>
                        </div>
                        
                        <div class="main small-scrollbar">
                            <div class="flex flex-col gap-4">
                            </div>
                        </div>

                        <div class="footer">
                            <IodButton type="button" class="w-40" label="Zurück" variant="contained" corner="pill" @click="setPage(3)" />
                            <HeSpacer />
                            <IodButton type="button" class="w-40" label="Weiter" variant="filled" corner="pill" @click="setPage(5)" />
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
                            <IodButton type="button" class="w-40" label="Zurück" variant="contained" corner="pill" @click="setPage(4)" />
                            <HeSpacer />
                            <IodButton type="button" class="w-40" label="Fertig" variant="filled" corner="pill" @click="close()" />
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const domain = useDomainStore()

    const isOpen = ref(false)
    const page = ref(0)
    const direction = ref('')

    function setPage(p: number) {
        if (p > 5) return
        if (p < 0) return

        direction.value = page.value < p ? 'forwards' : 'backwards'
        page.value = p
    }

    function open() {
        isOpen.value = true
        direction.value = '' // disables transition
        page.value = 0
    }

    function close() {
        isOpen.value = false
    }

    defineExpose({ open, close })



    // START: Domain step
    const logoInput = ref()
    const domainForm = useForm({
        company_name: domain?.settings?.company_name ?? '',
        company_legalname: domain?.settings?.company_legalname ?? '',
        company_slogan: domain?.settings?.company_slogan ?? '',
    })

    function isDomainSettingsValid() {
        return !!domainForm.company_name && !!domainForm.company_legalname
    }
    
    async function submitDomainLogo(e: any) {
        const file = e.target.files[0]
        if (!file) return

        await useAxios().postForm('/api/settings/logo', {file})
        logoInput.value.value = null
    }

    async function submitDomainSettings() {
        domainForm.patch('/api/settings', {
            onSuccess() {
                domain.fetchSettings()
                setPage(2)
            }
        })
    }
    // END: Domain step
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

                > img
                    height: 2.5rem
                    margin-block: 1.5rem
                    margin-right: auto

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