<template>
    <div class="page-layout">
        <header class="min-h-64 sm:min-h-72 md:min-h-80 lg:min-h-96">
            <ProfileImage
                v-if="domain.settings && domain.settings?.company_logo"
                class="h-24 sm:h-28 md:h-32 lg:h-36"
                aspect="2"
                :alt="domain.settings?.company_name"
                :src="domain.settings.company_logo"
            />
            <h2 v-else-if="domain.settings && domain.settings?.company_name">{{ domain.settings.company_name }}</h2>
            <h2 v-else>Helium Erstanmeldung</h2>
        </header>

        <main>
            <HeLimiter size="form">
                <HeCard class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <slot />
                </HeCard>
            </HeLimiter>
        </main>
        
        <footer v-if="domain.settings?.company_legalname">
            <HeLimiter size="form">
                <div class="flex flex-wrap gap-y-0 gap-x-2 py-4 px-4 sm:gap-x-4">
                    <span>© {{ $dayjs().year() }} {{ domain.settings?.company_legalname }}</span>
                    <HeSpacer class="hidden sm:block"/>
                    <a href="/legal" target="_blank">Impressum</a>
                    <a href="/privacy" target="_blank">Datenschutz</a>
                    <a href="/privacy" target="_blank">AGB</a>
                </div>
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
