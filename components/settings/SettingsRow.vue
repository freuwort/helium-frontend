<template>
    <HeFlex horizontal>
        <HeFlex class="flex-1">
            <slot name="description">
                <span v-if="title" class="font-heading text-text font-medium">{{ title }}</span>
                <small v-if="description">{{ description }}</small>
            </slot>
        </HeFlex>
        <HeFlex horizontal :gap="gap" :style="style">
            <slot />
        </HeFlex>
    </HeFlex>
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