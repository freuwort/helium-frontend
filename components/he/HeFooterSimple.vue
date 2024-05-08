<template>
    <footer>
        <div class="row menu-row">
            <HeLimiter>

                <div class="column">
                    <h2>Kontakt</h2>
                    <hr>
                    <a class="text-button" href="https://maps.app.goo.gl/YDRDYSWkZwUCdbEE8" target="_blank">
                        Hauptstraße 7, 38531 Rötgesbüttel
                    </a>
                    <a class="text-button" href="tel:053041293" target="_blank">Tel: 05304 / 1293</a>
                    <span class="text-button">Fax: 05304 / 930256</span>
                    <a class="text-button" href="mailto:info@emmerich-fleischerei.de"
                        target="_blank">info@emmerich-fleischerei.de</a>
                </div>
                <div class="column">
                    <h2>Über uns</h2>
                    <hr>
                    <NuxtLink class="text-button" to="/ueber-uns/geschichte">Geschichte</NuxtLink>
                    <NuxtLink class="text-button" to="/fleischlexikon">Fleischlexikon</NuxtLink>
                    <!-- <NuxtLink class="text-button" to="/emmerich24">Emmerich24</NuxtLink> -->
                    <NuxtLink class="text-button" to="/ueber-uns/dryager">DryAger</NuxtLink>
                    <NuxtLink class="text-button" to="/ueber-uns/strohschwein">Strohschwein Schwein</NuxtLink>
                </div>
                <div class="column">
                    <h2>Nachhaltigkeit</h2>
                    <hr>
                    <NuxtLink class="text-button" to="/nachhaltigkeit/co2-kuehlung">CO&#8322; Kühlung</NuxtLink>
                    <NuxtLink class="text-button" to="/nachhaltigkeit/ecobox">EcoBox</NuxtLink>
                    <NuxtLink class="text-button" to="/nachhaltigkeit/oekostrom">Ökostrom</NuxtLink>
                    <!-- <NuxtLink class="text-button" to="/">Lieferanten</NuxtLink> -->
                </div>
                <div class="column">
                    <h2>Rechtliches</h2>
                    <hr>
                    <NuxtLink class="text-button" to="/impressum">Impressum</NuxtLink>
                    <NuxtLink class="text-button" to="/datenschutz">Datenschutz</NuxtLink>
                    <NuxtLink class="text-button" to="/lizenzen">Lizenzen & Bildnachweise</NuxtLink>
                </div>
            </HeLimiter>
        </div>
        <div class="row copyright-row">
            <HeLimiter>
                <small>© {{ new Date().getFullYear() }} Logo Ipsum</small>
                <HeSpacer />
                <IodIconButton class="brand-button" is="a" href="#" target="_blank" variant="text" shape="pill" icon="&#62002;" aria-label="WhatsApp" />
                <IodIconButton class="brand-button" is="a" href="#" target="_blank" variant="text" shape="pill" icon="&#61805;" aria-label="Instagram" />
                <IodIconButton class="brand-button" is="a" href="#" target="_blank" variant="text" shape="pill" icon="&#61594;" aria-label="Facebook" />
            </HeLimiter>
        </div>
    </footer>
</template>

<script lang="ts" setup>
    const NuxtLink = defineNuxtLink({})
</script>

<style lang="sass" scoped>
    footer
        display: flex
        flex-direction: column

        .text-button
            display: flex
            align-items: center
            line-height: 2rem
            text-decoration: none
            color: var(--color-text-soft)

        a.text-button
            &:hover,
            &:focus
                color: var(--color-text)

        .brand-button
            --local-font: var(--font-brand) !important

        .row
            display: flex
            align-items: center

            .he-limiter
                display: flex !important

        .menu-row
            border-top: 1px solid var(--color-border)
            padding-block: 2rem

            .he-limiter
                gap: 1.5rem
                align-items: flex-start

        .copyright-row
            padding-block: .5rem
            min-height: 4rem
            background: var(--color-background-soft)

            .he-limiter
                align-items: center

        .column
            flex: 1
            display: flex
            flex-direction: column
            align-items: flex-start

            h2
                display: flex
                align-items: center
                height: 2.5rem
                margin: 0
                font-size: 1.25rem
                font-weight: 400
                letter-spacing: .025em

    

    @media screen and (max-width: 800px)
        footer
            .menu-row
                .he-limiter
                    flex-direction: column
                    align-items: stretch
</style>