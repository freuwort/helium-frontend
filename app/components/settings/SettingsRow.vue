<template>
    <div class="flex">
        <div class="flex flex-col w-80">
            <slot name="description">
                <span v-if="title" class="flex items-center min-h-8">{{ title }}</span>
                <small v-if="description">{{ description }}</small>
            </slot>
        </div>
        <div class="flex w-80">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps({
        title: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
        gap: {
            type: [Number, String],
            default: 1,
        },
        style: {
            type: [Object, String],
            default: () => ({ width: '18rem' }),
        }
    })
</script>