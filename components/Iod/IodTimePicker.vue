<template>
    <div class="iod-container iod-timepicker">
        <div class="header">
            <span class="font-mono">{{ reconstruct(internalValue) }}</span>
        </div>
        <div class="flex flex-col gap-6 px-4 py-6">
            <IodInput class="!h-10" placeholder="Schnelleingabe" v-model="quickInput" @blur="quickInputBlur"/>
        </div>
        <div class="footer">
            <IodButton class="!w-28" size="s" corner="pill" variant="contained" label="löschen" @click="setTime(null)"/>
            <IodButton class="!w-28" size="s" corner="pill" variant="filled" label="Jetzt" @click="setTime('now')"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    type Time = { h: number, m: number, s: number }

    const props = defineProps({
        modelValue: {
            type: [String, Number, null] as PropType<string | number | null>,
            default: null,
        },
        step: {
            type: [Number, String],
            default: 1,
        },
    })

    const emit = defineEmits(['update:modelValue'])



    const quickInput = ref('')
    const internalValue = ref<Time|null>({ h: 0, m: 0, s: 0 })



    const step = computed(() => parseInt(props.step as string))
    const useParts = computed(() => ({ h: true, m: step.value % 3600 != 0, s: step.value % 60 != 0 }))



    function setTime(value: string|null)
    {
        if (value === 'now') value = new Date().toLocaleTimeString()

        internalValue.value = value ? parse(value) : null
        quickInput.value = value ? reconstruct(internalValue.value) : ''

        emit('update:modelValue', value ? reconstruct(internalValue.value) : null)
    }



    function quickInputBlur(): void
    {
        quickInput.value = internalValue.value ? reconstruct(internalValue.value) : ''
    }



    function parse(input: string): Time | null
    {
        const timeWithColons = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/
        const timeWithoutColons = /^(\d{1,2})(\d{2})(\d{2})?$/
        const singleTimeDigit = /^\d{1,2}$/

        let hours: number
        let minutes: number = 0
        let seconds: number = 0

        // Match time
        if (!input)
        {
            return null
        }
        else if (timeWithColons.test(input))
        {
            const match = timeWithColons.exec(input)

            if (!match) return null

            hours = parseInt(match[1], 10)
            minutes = parseInt(match[2], 10)
            seconds = match[3] !== undefined ? parseInt(match[3], 10) : 0
        }
        else if (timeWithoutColons.test(input))
        {
            const match = timeWithoutColons.exec(input)
            if (!match) return null

            hours = parseInt(match[1], 10)
            minutes = parseInt(match[2], 10)
            seconds = match[3] !== undefined ? parseInt(match[3], 10) : 0
        }
        else if (singleTimeDigit.test(input))
        {
            hours = parseInt(input, 10)
        }
        else
        {
            return null
        }

        // Check and correct min and sec overflow
        if (minutes >= 60 || seconds >= 60)
        {
            seconds += minutes * 60
            minutes = Math.floor(seconds / 60)
            seconds %= 60

            hours += Math.floor(minutes / 60)
            minutes %= 60

            hours %= 24
        }

        // Check and correct hour flow
        hours %= 24

        return { h: hours, m: minutes, s: seconds }
    }

    function reconstruct(value: Time|null): string
    {
        let time = []
        if (useParts.value.h) time.push(value ? value.h.toString().padStart(2, '0') : '--')
        if (useParts.value.m) time.push(value ? value.m.toString().padStart(2, '0') : '--')
        if (useParts.value.s) time.push(value ? value.s.toString().padStart(2, '0') : '--')
        return time.join(':')
    }



    watch(() => props.modelValue, (value) => {
        internalValue.value = parse(value as string)
    }, { immediate: true })

    watch(quickInput, (value) => {
        internalValue.value = parse(value as string)
        if (internalValue.value) emit('update:modelValue', reconstruct(internalValue.value))
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-timepicker
        width: 300px
        display: flex
        flex-direction: column
        background: var(--color-background)
        border-radius: var(--radius-m)
        border: 1px solid var(--color-background-soft)

        .header
            display: flex
            align-items: center
            justify-content: center
            height: 5rem
            font-family: var(--font-mono)
            font-size: 1.5rem
            color: var(--color-background)
            background: var(--color-text)
            border-start-start-radius: inherit
            border-start-end-radius: inherit

        .footer
            display: flex
            align-items: center
            justify-content: space-between
            height: 4rem
            border-top: 1px solid var(--color-background-soft)
            border-end-start-radius: inherit
            border-end-end-radius: inherit
            padding-inline: 1rem
</style>