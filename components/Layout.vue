<template>
    <component :is="is" class="flex" :class="[direction, {'wrap': wrap}]" :style="{gap, padding}">
        <slot />
    </component>
</template>

<script lang="ts" setup>
    const props = defineProps({
        is: {
            type: String,
            default: 'div',
        },
        vertical: {
            type: Boolean,
            default: false,
        },
        horizontal: {
            type: Boolean,
            default: false,
        },
        wrap: {
            type: Boolean,
            default: false,
        },
        padding: {
            type: [String, Number],
            default: '0',
        },
        gap: {
            type: [String, Number],
            default: '0',
        },
    })

    const direction = computed(() => {
        if (props.horizontal) return 'horizontal'
        if (props.vertical) return 'vertical'
        return 'vertical'
    })

    const padding = computed(() => {
        if (typeof props.padding === 'number') return `${props.padding}rem`
        return props.padding
    })

    const gap = computed(() => {
        if (typeof props.gap === 'number') return `${props.gap}rem`
        return props.gap
    })
</script>