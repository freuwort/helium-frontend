<template>
    <div class="iod-container iod-pagination">
        <IodIconButton type="button" size="small" variant="text" icon="first_page" :disabled="page === 1" @click="$emit('update:modelValue', 1)" />
        <IodIconButton type="button" size="small" variant="text" icon="chevron_left" :disabled="page === 1" @click="$emit('update:modelValue', page - 1)" />
        
        <div class="range">
            <span><b>{{ startRange }} - {{ endRange }}</b> / {{ total }}</span>
        </div>
        
        <IodIconButton type="button" size="small" variant="text" icon="chevron_right" :disabled="page === pages" @click="$emit('update:modelValue', page + 1)" />
        <IodIconButton type="button" size="small" variant="text" icon="last_page" :disabled="page === pages" @click="$emit('update:modelValue', pages)" />
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        modelValue: {
            type: Number,
            default: 1,
        },
        size: {
            type: Number,
            default: 10,
        },
        total: {
            type: Number,
            default: 0,
        },
    })

    const emits = defineEmits([
        'update:modelValue'
    ])

    const page = computed(() => {
        // Clamp the page between 1 and the total pages
        return Math.min(Math.max(props.modelValue, 1), pages.value)
    })

    const pages = computed(() => {
        return Math.ceil(props.total / props.size)
    })

    const startRange = computed(() => {
        return (page.value - 1) * props.size + 1
    })

    const endRange = computed(() => {
        return Math.min(((page.value - 1) * props.size + props.size), props.total)
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-pagination
        display: inline-flex
        align-items: center
        justify-content: center
        gap: .25rem
        padding: .25rem
        height: 2.5rem
        border-radius: var(--radius-m)
        background: var(--color-background-soft)
        overflow: hidden
        user-select: none

        .iod-button
            --local-color-background: var(--color-text) !important

        .range
            display: flex
            align-items: center
            justify-content: center
            min-width: 10rem

            b
                font-weight: 500
                color: var(--color-text)
</style>