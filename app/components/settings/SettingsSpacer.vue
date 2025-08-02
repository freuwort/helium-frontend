<template>
    <div class="w-full" :style="{ height }"></div>
</template>

<script setup lang="ts">
    defineProps({
        height: {
            type: Number,
            default: '1rem',
        }
    })
</script>