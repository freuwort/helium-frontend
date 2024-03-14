<template>
    <component :is="is" class="margin-0 weight-medium">
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