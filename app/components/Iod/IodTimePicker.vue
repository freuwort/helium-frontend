<template>
    <div class="iod-container iod-timepicker">
        <div class="header">
            <span class="font-mono">{{ reconstruct(internalValue) }}</span>
        </div>
        <div class="body">
            <IodInput class="!h-10" placeholder="Schnelleingabe" v-model="quickInput" @blur="quickInputBlur"/>
        </div>
        <div class="footer">
            <IodButton class="flex-1" corner="pill" variant="contained" label="löschen" @click="setTime(null)"/>
            <IodButton class="flex-1" corner="pill" variant="filled" label="Jetzt" @click="setTime('now')"/>
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

        .body
            flex: 1
            display: flex
            flex-direction: column
            overflow: hidden
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