<template>
    <div class="page-layout">
        <header>
            <div class="company-logo" v-if="domain?.companyMeta">
                <img :src="domain?.companyMeta?.logo" :alt="domain?.companyMeta?.name" />
            </div>
            <h2>{{ domain?.companyMeta?.name }}</h2>
        </header>
        <main>
            <slot />
        </main>
        <footer>
            <div class="form-limiter">
                <Flex horizontal :gap="1">
                    <span>© {{ $dayjs().year() }} {{ domain?.companyMeta?.legalName }}</span>
                    <Spacer />
                    <a href="/legal" target="_blank">Impressum</a>
                    <a href="/privacy" target="_blank">Datenschutz</a>
                    <a href="/terms" target="_blank">AGB</a>
                    <a href="#">Cookies</a>
                </Flex>
            </div>
        </footer>
    </div>
</template>

<script lang="ts" setup>
    const props = useAttrs()
    const domain = useDomainStore()
    
    useHead({
        title: props.pageTitle as string,
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
        background-color: var(--color-text)
        background-image: url('/images/app/banner_pattern_light.png')
        background-size: auto 100%
        color: var(--color-background)
        min-height: 400px
        padding-bottom: 4rem
        margin-bottom: -4rem
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        gap: 1rem

        .company-logo
            width: 128px
            height: 128px
            padding: 16px
            display: flex
            justify-content: center
            align-items: center
            overflow: hidden
            border-radius: 50%
            box-shadow: var(--shadow-elevation-low)
            background-color: var(--color-background)
            user-select: none

        img
            width: 100%
            height: 100%
            object-fit: contain

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