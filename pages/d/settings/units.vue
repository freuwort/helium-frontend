<template>
    <form class="contents">
        <SettingsTitle>Basiseinheiten</SettingsTitle>

        <SettingsSpacer />
        <SettingsTitle>Währungen</SettingsTitle>
        <div class="grid currencies">
            <template v-for="currency in currencies">
                <div class="cell">{{currency.symbol}}</div>
                <div class="cell">{{currency.code}}</div>
                <div class="cell">{{currency.decimal_places}}</div>
                <div class="cell">{{currency.name}}</div>
            </template>
        </div>
        
        <SettingsSpacer />
        <SettingsTitle>Länder</SettingsTitle>
        <div class="grid countries">
            <template v-for="country in countries">
                <div class="cell">{{country.code}}</div>
                <div class="cell">{{country.alpha_3}}</div>
                <div class="cell">{{country.name}}</div>
            </template>
        </div>
    </form>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const baseUnits = ref([])
    const countries = ref([])
    const currencies = ref([])

    async function fetch()
    {
        let data = (await useAxios().get('/api/domain/units')).data

        baseUnits.value.push(...data.base_units)
        countries.value.push(...data.countries)
        currencies.value.push(...data.currencies)
    }

    onMounted(() => {
        fetch()
    })
</script>

<style lang="sass" scoped>
    .grid
        display: grid
        border-left: 1px solid var(--color-border)
        border-top: 1px solid var(--color-border)
        align-items: center
        grid-auto-rows: 3rem

        &.currencies
            grid-template-columns: 5rem 5rem 5rem 1fr

        &.countries
            grid-template-columns: 5rem 5rem 1fr

        .cell
            height: 100%
            padding-inline: 1rem
            display: flex
            align-items: center
            border-right: 1px solid var(--color-border)
            border-bottom: 1px solid var(--color-border)
</style>
