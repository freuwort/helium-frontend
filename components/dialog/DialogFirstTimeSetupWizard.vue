<template>
    <div class="fts-wizard">
        <div class="background"></div>
        <div class="inner">
            <div class="sidebar">
                <img src="/images/app/logo_white.svg" alt="Helium Logo">
                <h2>
                    Die ersten Schritte<br>
                    zu Ihrer
                    Helium Cloud
                </h2>
                <p>
                    Lassen Sie uns starten,<br>
                    Ihre Helium Cloud einzurichten
                </p>
                <HeSpacer />
                <small class="flex items-center h-14 py-2">
                    <NuxtLink to="https://docs.helium.cloud/de/first-time-setup" target="_blank">Hilfe</NuxtLink>
                    <HeSpacer />
                    <span>v2.0.0</span>
                </small>
            </div>
            <div class="content">
                <TransitionGroup :name="'slide-'+direction">
                    <div class="page" v-show="page === 0">
                        <div class="header">
                            <h3>Unternehmensdaten</h3>
                            <small class="px-2">Schritt <b>1</b> von <b>4</b></small>
                        </div>

                        <div class="main small-scrollbar">
                            <div class="flex flex-col gap-4">
                                <IodInput label="test"/>
                                <IodInput label="test"/>
                                <IodInput label="test"/>
                                <IodInput label="test"/>
                                <IodInput label="test"/>
                            </div>
                        </div>

                        <div class="footer">
                            <IodButton type="button" class="w-40" label="Zurück" variant="contained" corner="pill" @click="setPage(0)" />
                            <HeSpacer />
                            <IodButton type="button" class="w-40" label="Weiter" variant="filled" corner="pill" @click="setPage(1)" />
                        </div>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const page = ref(0)
    const direction = ref('foreward')

    function setPage(p: number) {
        if (p > 3) return
        if (p < 0) return

        direction.value = page.value < p ? 'forewards' : 'backwards'
        page.value = p
    }
</script>

<style lang="sass" scoped>
    .fts-wizard
        position: fixed
        top: 0
        bottom: 0
        left: 0
        right: 0
        z-index: 999999
        display: flex
        align-items: center
        justify-content: center

        .background
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            background: #00000099
            backdrop-filter: blur(20px)

        .inner
            position: relative
            z-index: 1
            display: flex
            width: calc(100% - 2rem)
            max-width: 900px
            height: calc(100% - 2rem)
            max-height: 600px
            background: var(--color-background)
            border-radius: var(--radius-xl)
            box-shadow: 0 0 0 5px var(--color-background), var(--shadow-l)

            .sidebar
                display: flex
                flex-direction: column
                padding-inline: 1.5rem
                width: 320px
                border-radius: inherit
                background-color: var(--color-text)
                background-image: url('/images/app/banner_pattern_light.png')
                background-size: 333% auto
                background-position: center 0
                color: var(--color-background-soft)

                > img
                    height: 2.5rem
                    margin-block: 1.5rem
                    margin-right: auto

                > h2
                    color: var(--color-background)
                    font-size: 1.5rem
                    font-weight: 500
                    margin: .75rem 0

                > p
                    margin: 0

                > small a
                    color: inherit

                > small a:hover
                    color: var(--color-background)
            
            .content
                flex: 1
                display: flex
                border-radius: inherit

                .page
                    flex: 1
                    display: grid
                    grid-template-rows: auto 1fr 3.5rem
                    grid-template-areas: 'header' 'main' 'footer'
                    padding-inline: 1.5rem
                    border-radius: inherit

                    .header
                        grid-area: header
                        height: 5.5rem
                        display: flex
                        align-items: center
                        padding-block: 1.5rem

                        > h3
                            flex: 1
                            font-size: 1.25rem
                            font-weight: 500
                            margin: 0

                    .main
                        grid-area: main
                        overflow-y: auto

                    .footer
                        grid-area: footer
                        display: flex
                        align-items: center
                        justify-content: space-between
                        padding-block: .5rem
</style>