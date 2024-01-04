<template>
    <component :is="is" class="background border-soft radius-l shadow-low">
        <slot />
    </component>
</template>

<script lang="ts" setup>
    defineProps({
        is: {
            default: 'div',
        },
    })
</script>