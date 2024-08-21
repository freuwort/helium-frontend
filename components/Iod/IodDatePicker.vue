<template>
    <div class="iod-container iod-datepicker">
        <div class="header">
            <span class="font-mono">{{ internalValue?.toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: '2-digit' }) ?? 'TT. MMM. JJJJ' }}</span>
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
    const props = defineProps({
        modelValue: {
            type: [String, null] as PropType<string | null>,
            default: null,
        },
        format: {
            type: String,
            default: 'YYYY-MM-DD',
        },
    })

    const emit = defineEmits(['update:modelValue'])



    const internalValue = ref<Date|null>(null)
    const selectedMonth = ref(7)
    const selectedYear = ref(2024)
    const selectedMonthString = computed(() => {
        return new Intl.DateTimeFormat('de-DE', { month: 'short' }).format(new Date(selectedYear.value, selectedMonth.value, 1))
    })

    const days = computed(() => {
        // Erstes Datum des Monats
        const firstDayOfMonth = new Date(selectedYear.value, selectedMonth.value, 1)
        firstDayOfMonth.setHours(0, 0, 0, 0)
        
        // Erster Tag des Monats (Wochentag)
        let startDay = firstDayOfMonth.getDay()
        
        // Wenn der erste Tag Sonntag ist, setzen wir startDay auf 7 (damit Sonntag nach Samstag kommt)
        if (startDay === 0) startDay = 7

        // Startdatum ist der Montag der Woche des ersten Tages des Monats
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
        return new Date(value)
    }



    watch(() => props.modelValue, (value) => {
        internalValue.value = parse(value)
        
        let today = internalValue.value ?? new Date()
        
        setSelected(today.getMonth(), today.getFullYear())
    }, { immediate: true })

    watch(internalValue, (value) => {
        emit('update:modelValue', value?.toISOString() ?? null)
    })
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
            color: var(--color-background)
            background-color: var(--color-text)
            background-image: url('/images/app/banner_pattern_light.png')
            background-size: auto 150%
            background-position: top center
            user-select: none
            border-top-left-radius: inherit
            border-top-right-radius: inherit

        .sub-header
            display: flex
            align-items: center
            padding: 1rem
            border-bottom: 1px solid var(--color-background-soft)

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
            border-top: 1px solid var(--color-background-soft)
            user-select: none
            border-bottom-left-radius: inherit
            border-bottom-right-radius: inherit
</style>