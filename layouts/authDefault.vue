<template>
    <div class="page-layout">
        <!-- Accessibility links -->
        <AppNavigationSkip href="#content" label="Navigation überspringen" icon="east"/>

        <AppHeader />

        <div class="hero" ref="hero" :style="heroStyle">
            <h2><slot name="title">{{ props.pageTitle }}</slot></h2>

            <div class="action-wrapper">
                <IodIconButton :icon="limiter.icon" size="s" variant="text" corner="pill" background="inherit" @click="toggleLimiter()" v-tooltip.left="'Seitebreite anpassen ('+limiter.label+')'"/>
                <!-- <IodIconButton icon="palette" size="s" variant="text" corner="pill" background="inherit" v-tooltip.left="'Seitefarbe anpassen'"/> -->
            </div>
        </div>

        <main id="content">
            <HeLimiter :size="limiter.size">
                <slot />
            </HeLimiter>
        </main>

        <DialogSetupDomain ref="ftsWizard"/>
    </div>
</template>

<script lang="ts" setup>
    const props = useAttrs()
    const auth = useAuthStore()
    const domain = useDomainStore()
    const splashscreen = useSplashscreenStore()
    const hero = ref<HTMLElement>()
    
    useHead({
        title: props.pageTitle as string,
        titleTemplate: `%s – ${domain?.settings?.company_name ?? 'Helium'} Verwaltung`,
        htmlAttrs: {
            'class': 'small-scrollbar',
            'style': 'background: var(--color-background-soft)',
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



    // START: Style
    const bestContrast = computed((): string => {
        // Return default color if no hero is set
        if (!hero.value) return 'light'
        
        // Get background color
        const color = getComputedStyle(hero.value as Element).backgroundColor
        .replace('rgb(', '')
        .replace(')', '')
        .split(',')
        .map((color) => parseInt(color))

        // Calculate contrast
        return Math.round((color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000) <= 128 ? 'light' : 'dark'
    })

    const heroStyle = computed(() => {
        return {
            backgroundColor: props.color as string,
            backgroundImage: `url(/images/app/banner_pattern_${bestContrast.value}.png)`,
            color: bestContrast.value === 'light' ? 'white' : '#1e293b',
        }
    })
    // END: Style



    // START: Scope
    const scope = computed(() => props.scope as string || 'view_general')
    // END: Scope

    
    
    // START: Limiter
    const limiterDict = [
        { id: 1, default: false, size: 'medium', label: 'Mittel', icon: 'width_normal', },
        { id: 2, default: true,  size: 'page',   label: 'Groß', icon: 'width_wide', },
        { id: 3, default: false, size: 'full',   label: 'Vollbreite', icon: 'width_full', },
    ]
    
    const limiter = computed(() => {
        return limiterFromSize(auth.getSettings(scope.value + '_page_limiter', props.limiter as string, 'db'))
    })

    const defaultLimiter = computed(() => {
        return limiterDict.find((limiter) => limiter.default) ?? limiterDict[0]
    })

    function limiterFromId(id: any) {
        return limiterDict.find((limiter) => limiter.id == id) ?? defaultLimiter.value
    }

    function limiterFromSize(size: any) {
        return limiterDict.find((limiter) => limiter.size == size) ?? defaultLimiter.value
    }

    function setLimiter(value: any) {
        auth.setSettings(scope.value + '_page_limiter', limiterFromSize(value).size, 'db')
    }

    function toggleLimiter() {
        if (limiter.value.size === 'medium') return setLimiter('page')
        if (limiter.value.size === 'page') return setLimiter('full')
        if (limiter.value.size === 'full') return setLimiter('medium')
    }
    // END: Limiter



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
        display: flex
        flex-direction: column
        min-height: 100%

        header
            position: sticky
            z-index: 1000
            top: 0

        .hero
            position: relative
            background-color: #1e293b
            background-image: url('/images/app/banner_pattern_light.png')
            background-size: auto 150%
            background-position: top center
            color: #ffffff
            border-bottom: 1px solid var(--color-border)
            min-height: 300px
            padding-bottom: 4.5rem
            margin-bottom: calc(-4.5rem - 2px)
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            gap: 1rem
            user-select: none

            h2
                margin: 0
                font-size: clamp(1.5rem, 5vw, 2.5rem)
                font-weight: 400
                text-align: center
                color: inherit

            .action-wrapper
                position: absolute
                top: 1rem
                right: 1rem
                display: flex
                flex-direction: column
                align-items: center
                padding: .25rem
                gap: .5rem
                border-radius: 4rem
                color: inherit
                
                &::before
                    content: ''
                    position: absolute
                    top: 0
                    right: 0
                    bottom: 0
                    left: 0
                    background: currentColor
                    opacity: .15
                    border-radius: inherit

        main
            position: relative
            flex: 1
            padding-bottom: 4.5rem
</style>
