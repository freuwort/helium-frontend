<template>
    <div class="page-layout">
        <AppHeader />
        <div class="hero">
            <h2 v-text="props.title"></h2>
        </div>
        <main>
            <slot />
        </main>
    </div>
</template>

<script lang="ts" setup>
    const props = useAttrs()
    const domain = useDomainStore()
    
    useHead({
        title: props.title as string,
        titleTemplate: `%s – ${domain?.companyMeta?.name} Verwaltung`,
        bodyAttrs: {
            class: 'background-soft'
        }
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
        background-color: var(--color-primary)
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
</style>
