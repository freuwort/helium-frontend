<script lang="ts" setup>
    defineProps({
        is: {
            type: String,
            default: 'div',
        },
    })
</script>

<template>
    <component :is="is" class="background border-soft radius-l shadow-low">
        <slot />
    </component>
</template>
