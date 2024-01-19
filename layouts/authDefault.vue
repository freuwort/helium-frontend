<template>
    <div class="page-layout">
        <AppHeader />
        <div class="hero" ref="hero" :style="{
            backgroundColor: props.color as string,
            backgroundImage: `url(/images/app/banner_pattern_${bestContrast}.png)`,
            color: bestContrast === 'light' ? 'white' : '#363E40',
        }">
            <h2><slot name="title">{{ props.pageTitle }}</slot></h2>
        </div>
        <main>
            <slot />
        </main>
    </div>
</template>

<script lang="ts" setup>
    const props = useAttrs()
    const domain = useDomainStore()
    const splashscreen = useSplashscreenStore()
    const hero = ref<HTMLElement>()
    
    useHead({
        title: props.pageTitle as string,
        titleTemplate: `%s – ${domain?.companyMeta?.name} Verwaltung`,
        htmlAttrs: {
            'class': 'background-soft small-scrollbar',
        },
    })

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



    onMounted(() => {
        // If this is the first page after a reload, show splashscreen
        if (!splashscreen.touched) splashscreen.start()

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
        position: sticky
        top: 0
        z-index: 1000

    .hero
        background-color: var(--color-text)
        background-image: url('/images/app/banner_pattern_light.png')
        background-size: auto 150%
        color: var(--color-background)
        min-height: 300px
        padding-bottom: 4rem
        margin-bottom: -4rem
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

    main
        flex: 1
        padding-bottom: 4rem
</style>
