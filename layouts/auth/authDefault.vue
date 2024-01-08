<template>
    <div class="page-layout">
        <AppHeader />
        <div class="hero">
            <h2>Unternehmen GmbH</h2>
        </div>
        <main>
            <slot />
        </main>
    </div>
</template>

<script lang="ts" setup>
    useHead({
        titleTemplate: '%s – ' + useDomainStore().companyMeta?.name + ' Verwaltung',
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
            font-size: 1.5rem
            font-weight: 500
            text-align: center
            color: inherit

    main
        flex: 1
</style>
