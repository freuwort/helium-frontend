<template>
    <div class="page-layout">
        <!-- Accessibility links -->
        <AppNavigationSkip href="#content" label="Navigation überspringen" icon="east"/>

        <!-- Header -->
        <AppHeader />

        <!-- Main -->
        <main id="content" class="small-scrollbar">
            <slot />
        </main>

        <!-- First time setup -->
        <DialogSetupDomain ref="ftsWizard"/>
    </div>
</template>

<script lang="ts" setup>
    const props = useAttrs()
    const auth = useAuthStore()
    const domain = useDomainStore()
    const splashscreen = useSplashscreenStore()
    
    useHead({
        title: props.pageTitle as string,
        titleTemplate: `%s – ${domain?.settings?.company_name ?? 'Helium'} Verwaltung`,
        htmlAttrs: {
            'class': 'small-scrollbar bg-background-disabled',
        },
    })



    // START: Setup Wizard
    const ftsWizard = ref()

    function openFtsWizard() {
        // Only continue if setup is not completed
        if (domain.settings.setup_completed) return

        // Only continue if setup is not dismissed
        if (domain.settings.setup_dismissed) return
        
        // User must have super admin permissions
        if (!auth.hasSuperAdminPermissions()) return

        // Open wizard
        ftsWizard.value.open()
    }
    // END: Setup Wizard



    // START: Scope
    const scope = computed(() => props.scope as string || 'view_general')
    // END: Scope



    // START: Splashscreen
    onMounted(() => {
        // If this is the first page after a reload, show splashscreen
        if (!splashscreen.touched) splashscreen.start()

        // Hide splashscreen if it is still idle
        if (!splashscreen.isIdle) splashscreen.finish()

        openFtsWizard()
    })
    // END: Splashscreen
</script>

<style scoped lang="sass">
    .page-layout
        display: grid
        grid-template-rows: 3.5rem 1fr
        grid-template-areas: "header" "content"
        height: 100%

        header
            grid-area: header

        main
            grid-area: content
            background: var(--color-background)
            border-radius: var(--radius-m)
            overflow-x: hidden
            overflow-y: auto
            margin: .25rem
            margin-top: 0
</style>
