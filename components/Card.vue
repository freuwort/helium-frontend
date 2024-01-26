<template>
    <component :is="is" class="background border-soft radius-xl shadow-low">
        <slot />
    </component>
</template>

<script lang="ts" setup>
    defineProps({
        is: {
            type: [String, Object, Function, Symbol, Array, Promise, Boolean, Number],
            default: 'div',
        },
    })
</script>