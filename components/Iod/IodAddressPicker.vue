<template>
    <div class="iod-container iod-timepicker">
        <div class="header">
            <span>{{ [internalValue.address_line_1, internalValue.address_line_2].join(' ') }}</span>
            <span>{{ [internalValue.postal_code, internalValue.city].join(' ') }}</span>
            <span>{{ [internalValue.state, internalValue.country_code].join(' ') }}</span>
        </div>
        <div class="body">
            <div class="flex flex-col gap-2">
                <IodInput label="Straße und Hausnummer" v-model="internalValue.address_line_1" />
                <!-- <IodInput label="Zusatz" v-model="internalValue.address_line_2" /> -->
            </div>
            <div class="flex flex-col gap-2">
                <IodInput label="Postleitzahl" v-model="internalValue.postal_code" />
                <IodInput label="Stadt" v-model="internalValue.city" />
            </div>
            <!-- <div class="flex flex-col gap-2">
                <IodInput label="Bundesland" v-model="internalValue.state" />
                <IodSelect class="!h-10" label="Land" v-model="internalValue.country_code" :options="countries.map((e: Country) => ({text: e.name, value: e.code}))"/>
            </div> -->
        </div>
        <div class="footer">
            <IodButton class="flex-1" corner="pill" variant="contained" label="löschen" @click="setAddress('reset')"/>
            <IodButton class="flex-1" corner="pill" variant="filled" label="Übernehmen" @click="setAddress()"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    type Address = {
        address_line_1: string
        address_line_2: string
        city: string
        state: string
        postal_code: string
        country_code: string
    }

    const props = defineProps({
        modelValue: {
            type: [Object, null] as PropType<Address|null>,
            default: null,
        },
        step: {
            type: [Number, String],
            default: 1,
        },
    })

    const emit = defineEmits(['update:modelValue'])



    const internalValue = ref<Address>({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country_code: '',
    })



    function setAddress(action?: string): void
    {
        internalValue.value = parse(action === 'reset' ? null : internalValue.value)
        emit('update:modelValue', action === 'reset' ? null : internalValue.value)
    }



    function parse(input: Address|null): Address
    {
        let address: Partial<Address> = input || {}

        return {
            address_line_1: address?.address_line_1 || '',
            address_line_2: address?.address_line_2 || '',
            city: address?.city || '',
            state: address?.state || '',
            postal_code: address?.postal_code || '',
            country_code: address?.country_code || '',
        }
    }



    watch(() => props.modelValue, (value) => {
        internalValue.value = parse(value)
    }, { immediate: true })
</script>

<style lang="sass" scoped>
    .iod-container.iod-timepicker
        width: 360px
        display: flex
        flex-direction: column
        background: var(--color-background)

        .header
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            height: 7rem
            padding-inline: 1rem
            font-size: 1rem
            line-height: 1.4
            color: #ffffff
            background-color: #1e293b
            background-image: url('/images/app/banner_pattern_light.png')
            background-size: auto 150%
            background-position: top center
            border-bottom: 1px solid var(--color-border)
            user-select: none
            border-top-left-radius: inherit
            border-top-right-radius: inherit

        .body
            flex: 1
            display: flex
            flex-direction: column
            overflow: hidden
            gap: 1rem
            padding: 1rem

        .footer
            display: flex
            align-items: center
            padding: 1rem
            gap: 1rem
            border-top: 1px solid var(--color-border)
            border-bottom-left-radius: inherit
            border-bottom-right-radius: inherit
</style>