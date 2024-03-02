<template>
    <div class="page-layout">
        <AppHeader />
        <aside class="sidebar">
            <slot name="sidebar" />
        </aside>
        <main class="small-scrollbar">
            <div :class="limiter">
                <slot />
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
    const props = useAttrs()
    const domain = useDomainStore()
    const splashscreen = useSplashscreenStore()
    
    useHead({
        title: props.pageTitle as string,
        titleTemplate: `%s – ${domain?.settings?.company_name} Verwaltung`,
        htmlAttrs: {
            'class': 'background-soft',
        },
    })

    const limiter = computed(() => {
        return `${props.limiter || 'normal'}-limiter`
    })



    onMounted(() => {
        // If this is the first page after a reload, show splashscreen
        if (!splashscreen.touched) splashscreen.start()

        // Hide splashscreen if it is still idle
        if (!splashscreen.isIdle) splashscreen.finish()
    })
</script>

<style scoped lang="sass">
    .page-layout
        display: grid
        grid-template-columns: auto 1fr
        grid-template-rows: min-content auto
        grid-template-areas: "header header" "sidebar main"
        height: 100%

    header
        grid-area: header
        position: sticky
        top: 0
        z-index: 1000

    .sidebar
        grid-area: sidebar
        margin-block: 1rem
        background: var(--color-background)
        box-shadow: var(--shadow-elevation-medium)
        border-radius: 0 var(--radius-l) var(--radius-l) 0

    main
        grid-area: main
        padding-bottom: 4.5rem
        overflow: scroll
</style>
