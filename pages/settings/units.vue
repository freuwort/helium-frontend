<template>
    <div class="flex items-center min-h-10">
        <h3 class="flex-1 m-0 font-medium">Einheiten</h3>
        <IodButton type="button" @click="fetch()" icon-right="refresh" corner="pill" label="Aktualisieren" :loading/>
    </div>
    
    <div class="table small-scrollbar">
        <IodLoader type="bar" class="absolute top-0 left-0 right-2 z-10" v-show="loading"/>
        <div class="row header">
            <span class="w-8"><IodIcon icon="square_foot"/></span>
            <span class="flex-1">Basiseinheit</span>
            <span class="flex-1">Code</span>
            <span class="w-32">Symbol</span>
        </div>
        <div class="row" v-for="unit in units">
            <span class="w-8"><IodIcon icon="square_foot"/></span>
            <span class="flex-1">{{unit.name || '-'}}</span>
            <span class="flex-1">{{unit.code || '-'}}</span>
            <span class="w-32">{{unit.symbol || '-'}}</span>
        </div>
        <IodAlert type="placeholder" class="h-40" text="Keine Basiseinheiten gefunden" v-if="!units.length"/>

        <div class="row header">
            <span class="w-8"><IodIcon icon="attach_money"/></span>
            <span class="flex-1">Währung</span>
            <span class="flex-1">Code</span>
            <span class="w-32">Symbol</span>
        </div>
        <div class="row" v-for="currency in currencies">
            <span class="w-8"><IodIcon icon="attach_money"/></span>
            <span class="flex-1">{{currency.name || '-'}}</span>
            <span class="flex-1">{{currency.code || '-'}}</span>
            <span class="w-32">{{currency.symbol || '-'}}</span>
        </div>
        <IodAlert type="placeholder" class="h-40" text="Keine Währungen gefunden" v-if="!currencies.length"/>

        <div class="row header">
            <span class="w-8"><IodIcon icon="language"/></span>
            <span class="flex-1">Land</span>
            <span class="flex-1">Code</span>
            <span class="w-32">Symbol</span>
        </div>
        <div class="row" v-for="country in countries">
            <span class="w-8"><IodIcon icon="language"/></span>
            <span class="flex-1">{{country.name || '-'}}</span>
            <span class="flex-1">{{country.code || '-'}}</span>
            <span class="w-32">{{country.alpha_3 || '-'}}</span>
        </div>
        <IodAlert type="placeholder" class="h-40" text="Keine Länder gefunden" v-if="!countries.length"/>
    </div>
</template>

<script lang="ts" setup>
    import type { Unit, Country, Currency } from '~/types/units'

    const units = ref([] as Unit[])
    const countries = ref([] as Country[])
    const currencies = ref([] as Currency[])
    const loading = ref(false)

    async function fetch() {
        loading.value = true
        let data = (await useAxios().get('/api/domain/units')).data
        loading.value = false

        units.value = data.units
        countries.value = data.countries
        currencies.value = data.currencies
    }

    onMounted(() => {
        fetch()
    })
</script>

<style lang="sass" scoped>
    .table
        display: flex
        flex-direction: column
        border: 1px solid var(--color-border)
        border-radius: var(--radius-m)
        overflow: auto
        max-height: 30rem
        position: relative

        .row
            display: flex
            align-items: center
            height: 2.5rem
            gap: .5rem
            padding-inline: 1rem

            > span
                position: relative
                z-index: 1
                display: flex
                align-items: center
                align-self: stretch
                height: inherit

            &.header
                height: 3rem
                position: sticky
                z-index: 2
                top: 0
                transform: translateY(-1px)
                font-weight: bold
                border-bottom: 1px solid var(--color-border)
                border-top: 1px solid var(--color-border)
                backdrop-filter: blur(6px)

                &::after
                    content: ''
                    position: absolute
                    top: 0
                    left: 0
                    width: 100%
                    height: 100%
                    background: var(--color-background)
                    opacity: .8

    .grid
        display: grid
        align-items: center
        grid-auto-rows: 2.5rem
        gap: .5rem
        overflow: auto
        max-height: 20rem
        border: 1px solid var(--color-border)
        border-radius: var(--radius-l)
        padding: .5rem

        &.units
            grid-template-columns: 1fr 1fr 10rem

        &.currencies
            grid-template-columns: 1fr 1fr 10rem

        &.countries
            grid-template-columns: 1fr 1fr 10rem

        .cell
            height: 100%
            padding-inline: .75rem
            display: flex
            align-items: center
            border-radius: var(--radius-m)

        b.cell
            background: var(--color-background-soft)
</style>
