<template>
    <div class="iod-container iod-datepicker">
        <div class="header">
            <span class="font-mono">{{ displayValue }}</span>
        </div>
        <div class="sub-header">
            <IodIconButton icon="keyboard_double_arrow_left" corner="pill" variant="text" @click="updateSelected(-12)"/>
            <IodIconButton icon="keyboard_arrow_left" corner="pill" variant="text" @click="updateSelected(-1)"/>
            <div class="flex-1 text-center">{{ selectedMonthString }} {{ selectedYear }}</div>
            <IodIconButton icon="keyboard_arrow_right" corner="pill" variant="text" @click="updateSelected(1)"/>
            <IodIconButton icon="keyboard_double_arrow_right" corner="pill" variant="text" @click="updateSelected(12)"/>
        </div>
        <div class="body">
            <IodButton label="Mo" corner="pill" variant="text" disabled/>
            <IodButton label="Di" corner="pill" variant="text" disabled/>
            <IodButton label="Mi" corner="pill" variant="text" disabled/>
            <IodButton label="Do" corner="pill" variant="text" disabled/>
            <IodButton label="Fr" corner="pill" variant="text" disabled/>
            <IodButton label="Sa" corner="pill" variant="text" disabled/>
            <IodButton label="So" corner="pill" variant="text" disabled/>

            <IodButton
                v-for="day in days"
                :key="day.date.toDateString()"
                :label="day.day"
                corner="pill"
                :variant="day.date.getTime() === internalValue?.getTime() ? 'filled' : day.today ? 'contained' : 'text'"
                :background="day.inMonth || day.date.getTime() === internalValue?.getTime() ? 'var(--color-text)' : 'var(--color-text-soft-disabled)'"
                @click="internalValue = day.date"
                v-tooltip="day.date.toDateString()"
                />
        </div>
        <div class="footer">
            <IodButton class="flex-1" corner="pill" variant="contained" label="löschen" @click="setDate(null)"/>
            <IodButton class="flex-1" corner="pill" variant="filled" label="Heute" @click="setDate('now')"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import dayjs from 'dayjs'



    const props = defineProps({
        modelValue: {
            type: [String, null] as PropType<string | null>,
            default: null,
        },
        format: {
            type: [String, null] as PropType<string | null>,
            default: 'YYYY-MM-DD',
        },
        displayFormat: {
            type: String,
            default: 'DD. MMM YYYY',
        },
        placeholder: {
            type: String,
            default: 'TT. MMM. JJJJ',
        },
    })

    const emit = defineEmits(['update:modelValue'])



    const internalValue = ref<Date|null>(null)
    const selectedMonth = ref(0)
    const selectedYear = ref(2000)
    const selectedMonthString = computed(() => dayjs().month(selectedMonth.value).format('MMM'))

    const days = computed(() => {
        const firstDayOfMonth = new Date()
        
        firstDayOfMonth.setFullYear(selectedYear.value)
        firstDayOfMonth.setMonth(selectedMonth.value)
        firstDayOfMonth.setDate(1)
        firstDayOfMonth.setHours(0, 0, 0, 0)
        
        // First day of month (weekday)
        let startDay = firstDayOfMonth.getDay()
        
        // If first day is Sunday, set startDay to 7 (so that Sunday comes after Saturday)
        if (startDay === 0) startDay = 7

        // Start date is the monday of the first day of the month
        let startDate = new Date(firstDayOfMonth)
        startDate.setDate(firstDayOfMonth.getDate() - (startDay - 1))
        
        const days = []

        for (let i = 0; i < 42; i++)
        {
            days.push({
                day: startDate.getDate().toString(),
                date: new Date(startDate),
                inMonth: startDate.getMonth() === selectedMonth.value,
                today: startDate.toDateString() === new Date().toDateString(),
            })

            startDate.setDate(startDate.getDate() + 1)
        }

        return days
    })

    const displayValue = computed(() => {
        if (!internalValue.value) return props.placeholder
        return dayjs(internalValue.value).format(props.displayFormat)
    })



    function setDate(value: Date|'now'|null)
    {
        if (value === 'now') value = new Date()
        if (value) value.setHours(0, 0, 0, 0)

        internalValue.value = value ?? null
    }



    function setSelected(month: number, year: number)
    {
        selectedMonth.value = month
        selectedYear.value = year
    }

    function updateSelected(months: number)
    {
        let currentMonth = selectedMonth.value
        let currentYear = selectedYear.value

        const totalMonths = currentMonth + months
        
        const newYear = currentYear + Math.floor(totalMonths / 12)
        const newMonth = (totalMonths % 12 + 12) % 12

        selectedYear.value = newYear
        selectedMonth.value = newMonth
    }



    function parse(value: string|null)
    {
        if (!value) return null

        if (props.format) return dayjs(value, props.format).hour(0).minute(0).second(0).millisecond(0).toDate()
        
        return new Date(value)
    }



    watch(() => props.modelValue, (value) => {
        internalValue.value = parse(value)
        
        let today = internalValue.value ?? new Date()
        
        setSelected(today.getMonth(), today.getFullYear())
    }, { immediate: true })

    watch(internalValue, (value) => {
        if (!value) return emit('update:modelValue', null)

        if (props.format) return emit('update:modelValue', dayjs(value).format(props.format))

        return emit('update:modelValue', value.toISOString())
    })



    defineExpose([
        displayValue,
    ])
</script>

<style lang="sass" scoped>
    .iod-container.iod-datepicker
        width: 360px
        display: flex
        flex-direction: column
        background: var(--color-background)

        .header
            display: flex
            align-items: center
            justify-content: center
            height: 7rem
            font-family: var(--font-mono)
            font-size: 1.5rem
            color: #ffffff
            background-color: #1e293b
            background-image: url('/images/app/banner_pattern_light.png')
            background-size: auto 150%
            background-position: top center
            border-bottom: 1px solid var(--color-border)
            user-select: none
            border-top-left-radius: inherit
            border-top-right-radius: inherit

        .sub-header
            display: flex
            align-items: center
            padding: 1rem
            border-bottom: 1px solid var(--color-border)

        .body
            display: grid
            grid-template-columns: repeat(7, 1fr)
            grid-template-rows: repeat(7, 1fr)
            gap: .5rem
            padding: 1rem

            .iod-button
                padding: 0 !important
                text-transform: none
                letter-spacing: 0

        .footer
            display: flex
            align-items: center
            padding: 1rem
            gap: 1rem
            border-top: 1px solid var(--color-border)
            user-select: none
            border-bottom-left-radius: inherit
            border-bottom-right-radius: inherit
</style>