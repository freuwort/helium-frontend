<template>
    <div class="page-layout sm:min-h-full">
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

        <main class="sm:flex-1">
            <HeLimiter size="form" class="!max-w-full !px-0 sm:!max-w-[550px] sm:!px-4">
                <HeCard class="flex flex-col px-6 py-6 gap-6 !rounded-none sm:gap-8 sm:py-8 sm:!rounded-2xl border" :class="props.pageClass">
                    <slot />
                </HeCard>
            </HeLimiter>
        </main>
        
        <footer v-if="showFooter">
            <HeLimiter size="form" class="!max-w-full !px-0 sm:!max-w-[550px] sm:!px-4">
                <div class="flex flex-wrap gap-y-0 gap-x-2 py-4 px-4 sm:gap-x-4">
                    <span v-if="domain.settings?.company_legalname">© {{ $dayjs().year() }} {{ domain.settings?.company_legalname }}</span>
                    <HeSpacer class="hidden sm:block"/>
                    <NuxtLink v-if="domain.settings?.legal_notice" :to="domain.settings?.legal_notice" target="_blank">Impressum</NuxtLink>
                    <NuxtLink v-if="domain.settings?.legal_privacy" :to="domain.settings?.legal_privacy" target="_blank">Datenschutz</NuxtLink>
                    <NuxtLink v-if="domain.settings?.legal_terms" :to="domain.settings?.legal_terms" target="_blank">AGB</NuxtLink>
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
            style: 'background: var(--color-background-disabled)',
        }
    })

    onMounted(() => {
        // Hide splashscreen if it is still idle
        if (!splashscreen.isIdle) splashscreen.finish()
    })

    const showFooter = computed(() =>
        domain.settings?.company_legalname ||
        domain.settings?.legal_notice ||
        domain.settings?.legal_privacy ||
        domain.settings?.legal_terms
    )
</script>

<style scoped lang="sass">
    .page-layout
        display: flex
        flex-direction: column

    header
        background-color: var(--color-background-soft)
        background-image: url('/images/app/banner_pattern_dark.png')
        background-size: auto 100%
        background-position: top center
        color: var(--color-text)
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

    footer
        min-height: 4rem
        display: flex
        align-items: center
        justify-content: center

        a
            color: var(--color-text-soft)
</style>
