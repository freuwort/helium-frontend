<template>
    <div class="iod-container iod-icon-color-picker flex flex-col">
        <div class="flex flex-col gap-1" v-if="hasColor">
            <span class="px-1">Farbe</span>
            <div class="grid">
                <IodIconButton type="button" v-for="colorOption in colorOptions" corner="m" size="s" icon="opacity" :background="colorOption" :variant="color == colorOption ? 'filled' : 'text'" @click="$emit('update:color', colorOption)"/>
            </div>
        </div>

        <div class="flex flex-col gap-1" v-if="hasIcon">
            <span class="px-1">Icon</span>
            <div class="grid">
                <IodIconButton type="button" v-for="iconOption in iconOptions" corner="m" size="s" :icon="iconOption" :background="color" :variant="icon == iconOption ? 'filled' : 'text'" @click="$emit('update:icon', iconOption)"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        hasColor: {
            type: Boolean,
            default: false,
        },
        hasIcon: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: 'category',
        },
        color: {
            type: String,
            default: '#363E40',
        },
    })

    const iconOptions = [
        'category',
        'label',
        'person',
        'shield',
        'verified_user',
        'shopping_cart',
        'store',
        'work',
        'call',
        'settings',

        'star',
        'favorite',
        'home',
        'pets',
        'school',
        'build',
        'monitoring',
        'local_shipping',
        'dns',
        'smart_toy',
    ]

    const colorOptions = [
        'rgb(22 160 133)',
        'rgb(34 197 94)',
        'rgb(245 158 11)',
        'rgb(249 115 22)',
        'rgb(244 63 94)',
        'rgb(168 85 247)',
        'rgb(113 88 226)',
        'rgb(99 102 241)',
        'rgb(59 130 246)',
        'rgb(51 65 85)',

        'rgb(26 188 156)',
        'rgb(74 222 128)',
        'rgb(251 191 36)',
        'rgb(251 146 60)',
        'rgb(251 113 133)',
        'rgb(192 132 252)',
        'rgb(125 95 255)',
        'rgb(129 140 248)',
        'rgb(96 165 250)',
        'rgb(100 116 139)',
    ]
</script>

<style lang="sass" scoped>
    .iod-container.iod-icon-color-picker
        .grid 
            display: grid
            grid-template-columns: repeat(10, 2rem)
            justify-content: space-between
            gap: .25rem
</style>