<template>
    <VDropdown :distance="6" placement="bottom-start">
        <IodIconButton type="button" :icon="icon" size="l" corner="pill" variant="contained" :background="color" v-tooltip.bottom="'Farbe und Icon wählen'" />
        <template #popper>
            <HeFlex :padding="1">
                <template v-if="hasColor">
                    <ContextMenuLabel label="Farben" style="padding: 0;"/>
                    <HeFlex horizontal wrap class="w-80">
                        <IodIconButton type="button" v-for="colorOption in colorOptions" corner="pill" icon="radio_button_unchecked" :background="colorOption" :variant="color == colorOption ? 'contained' : 'text'" @click="$emit('update:color', colorOption)"/>
                    </HeFlex>
                </template>

                <template v-if="hasIcon">
                    <ContextMenuLabel label="Icons" style="padding: 0; padding-top: 1rem"/>
                    <HeFlex horizontal wrap class="w-80">
                        <IodIconButton type="button" v-for="iconOption in iconOptions" corner="pill" :icon="iconOption" :background="color" :variant="icon == iconOption ? 'contained' : 'text'" @click="$emit('update:icon', iconOption)"/>
                    </HeFlex>
                </template>
            </HeFlex>
        </template>
    </VDropdown>
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

        'star',
        'favorite',
        'home',
        'pets',
        'school',
        'build',
        'local_shipping',
        'dns',
    ]

    const colorOptions = [
        'rgb(34 197 94)',
        'rgb(245 158 11)',
        'rgb(249 115 22)',
        'rgb(244 63 94)',
        'rgb(168 85 247)',
        'rgb(99 102 241)',
        'rgb(59 130 246)',
        'rgb(51 65 85)',

        'rgb(74 222 128)',
        'rgb(251 191 36)',
        'rgb(251 146 60)',
        'rgb(251 113 133)',
        'rgb(192 132 252)',
        'rgb(129 140 248)',
        'rgb(96 165 250)',
        'rgb(100 116 139)',
    ]
</script>