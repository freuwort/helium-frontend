<template>
    <div class="iod-container iod-range">
        <div class="indicator">
            <div class="progress" :style="{ width: progress+'%' }"></div>
            <div class="handle" :style="{ left: progress+'%' }"></div>
        </div>

        <AreaSlider class="iod-slider" :padding="4" :x="value" @update:x="update($event)" />
    </div>
</template>

<script lang="ts" setup>
    import AreaSlider from './partials/AreaSlider.vue'
    
    const props = defineProps({
        min: {
            type: [Number, String],
            default: 0
        },
        max: {
            type: [Number, String],
            default: 100
        },
        step: {
            type: [Number, String],
            default: 1
        },
        modelValue: {
            type: [Number, String],
            default: 0
        },
    })

    const emits = defineEmits(['update:modelValue'])

    const min = computed(() => parseFloat(props.min+''))
    const max = computed(() => parseFloat(props.max+''))
    const step = computed(() => parseFloat(props.step+''))
    const range = computed(() => max.value - min.value)
    const progress = computed(() => (value.value - min.value) / range.value * 100)
    
    const value = ref(parse(props.modelValue))
    
    function map(percent: number): number {
        return Math.round((percent * range.value + min.value) / step.value) * step.value
    }

    function parse(value: number|string): number {
        if (typeof value === 'string') value = parseFloat(value)
        if (isNaN(value)) value = min.value
        if (value === null) value = min.value
        if (value === undefined) value = min.value

        return Math.max(min.value, Math.min(max.value, value))
    }

    function update(percent: number) {
        let newValue = map(percent)
        
        if (newValue === value.value) return

        value.value = newValue

        emits('update:modelValue', value.value)
    }
</script>

<style lang="sass" scoped>
    .iod-container.iod-range
        position: relative
        width: 100%
        height: 20px
        user-select: none
        --handle-size: 16px
        --handle-border: 1px solid var(--color-border)
        --handle-border-radius: 50%
        --handle-background: var(--color-background)
        --bar-background: var(--color-background-soft)
        --progress-background: var(--color-text)

        .indicator
            position: absolute
            top: 50%
            left: 4px
            right: 4px
            transform: translateY(-50%)
            height: 4px
            background: var(--bar-background)
            border-radius: 2px
            pointer-events: none

            .progress
                position: absolute
                top: 0
                left: 0
                height: 100%
                background: var(--progress-background)
                border-radius: inherit

            .handle
                position: absolute
                height: var(--handle-size)
                width: var(--handle-size)
                background: var(--handle-background)
                border: var(--handle-border)
                border-radius: var(--handle-border-radius)
                box-shadow: var(--shadow-s)
                top: 50%
                transform: translate(-50%, -50%)
                z-index: 1
                pointer-events: none

        .iod-slider
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
</style>