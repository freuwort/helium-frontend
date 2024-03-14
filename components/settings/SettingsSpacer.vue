<template>
    <div class="w-100p" :style="{ height }"></div>
</template>

<script setup lang="ts">
    defineProps({
        height: {
            type: Number,
            default: '1rem',
        }
    })
</script>