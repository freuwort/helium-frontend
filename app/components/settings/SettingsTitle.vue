<template>
    <component :is="is" class="m-0 font-medium">
        <slot>{{ title }}</slot>
    </component>
</template>

<script setup lang="ts">
    defineProps({
        is: {
            type: [String, Object, Function, Array],
            default: 'h5',
        },
        title: {
            type: String,
            default: '',
        },
    })
</script>