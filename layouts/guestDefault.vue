<template>
    <div class="page-layout">
        <header>
            <ProfileImage
                v-if="domain.settings && domain.settings?.company_logo"
                class="h-32"
                aspect="2"
                :alt="domain.settings?.company_name"
                :src="domain.settings.company_logo"
            />
            <h2 v-else-if="domain.settings && domain.settings?.company_name">{{ domain.settings.company_name }}</h2>
            <h2 v-else>Helium Erstanmeldung</h2>
        </header>
        <main>
            <slot />
        </main>
        <footer v-if="domain.settings?.company_legalname">
            <HeLimiter size="form">
                <HeFlex horizontal gap="1rem">
                    <span>© {{ $dayjs().year() }} {{ domain.settings?.company_legalname }}</span>
                    <HeSpacer />
                    <a href="/legal" target="_blank">Impressum</a>
                    <a href="/privacy" target="_blank">Datenschutz</a>
                </HeFlex>
            </HeLimiter>
        </footer>
    </div>
</template>

<script lang="ts" setup>
    const props = useAttrs()
    const domain = useDomainStore()
    const splashscreen = useSplashscreenStore()
    
    useHead({
        title: props.pageTitle as string,
        titleTemplate: `%s – ${domain.settings?.company_name || 'Helium'} Verwaltung`,
        bodyAttrs: {
            style: 'background: var(--color-background-soft)',
        }
    })

    onMounted(() => {
        // Hide splashscreen if it is still idle
        if (!splashscreen.isIdle) splashscreen.finish()
    })
</script>

<style scoped lang="sass">
    .page-layout
        display: flex
        flex-direction: column
        min-height: 100%

    header
        background-color: #1e293b
        background-image: url('/images/app/banner_pattern_light.png')
        background-size: auto 100%
        background-position: top center
        color: #ffffff
        border-bottom: 1px solid var(--color-border)
        min-height: 400px
        padding-bottom: 4.5rem
        margin-bottom: -4.5rem
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        gap: 1rem

        h2
            margin: 0
            font-size: 1.5rem
            font-weight: 500
            text-align: center
            color: inherit

    main
        flex: 1

    footer
        min-height: 4rem
        display: flex
        align-items: center
        justify-content: center

        a
            color: var(--color-text-soft)
</style>
