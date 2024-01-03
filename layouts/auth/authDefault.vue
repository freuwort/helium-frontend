<script lang="ts" setup>
    useHead({
        titleTemplate: '%s – ' + useDomainStore().companyMeta?.name,
        bodyAttrs: {
            class: 'background-soft'
        }
    });
</script>

<template>
    <div class="page-layout">
        <header>
            <h2>Unternehmen GmbH</h2>
        </header>
        <main>
            <slot />
        </main>
        <footer>
            <div class="form-limiter">
                <Layout horizontal :gap="1">
                    <span>© {{ $dayjs().year() }} {{ useDomainStore().companyMeta?.legalName }}</span>
                    <Spacer />
                    <a href="/legal" target="_blank">Impressum</a>
                    <a href="/privacy" target="_blank">Datenschutz</a>
                    <a href="/terms" target="_blank">AGB</a>
                    <a href="#">Cookies</a>
                </Layout>
            </div>
        </footer>
    </div>
</template>

<style scoped lang="sass">
    .page-layout
        display: flex
        flex-direction: column
        min-height: 100%

    header
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

    footer
        min-height: 4rem
        display: flex
        align-items: center
        justify-content: center
        font-size: .875rem

        a
            color: var(--color-text-soft)
</style>
