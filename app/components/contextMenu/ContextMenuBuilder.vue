<template>
    <ContextMenu>
        <template v-for="item in items">
            <ContextMenuItem is="button" v-if="typeof item === 'string'" :icon="defaultIcon" :label="item" @click="emit('click', item)" v-tooltip.right="item +' hinzufügen'"/>
            <ContextMenuItem is="button" v-else-if="item.type === 'item'" :icon="item.icon || defaultIcon" :label="item.label" @click="emit('click', item.value)" v-tooltip.right="item.label +' hinzufügen'"/>
            
            <ContextMenuDivider v-else-if="item.type === 'divider'"/>
            
            <ContextMenuLabel v-else-if="item.type === 'label'" :label="item.label"/>
            
            <VDropdown v-else-if="item.type === 'submenu'" placement="right" :distance="0">
                <ContextMenuItem :label="item.label" :icon="item.icon || defaultIcon" show-chevron />
                <template #popper>
                    <ContextMenuBuilder :items="item.items" :default-icon="item.icon || defaultIcon" @click="emit('click', $event)" class="min-w-64" />
                </template>
            </VDropdown>
        </template>
    </ContextMenu>
</template>

<script lang="ts" setup>
    export type ContextMenuItem = {
        type: 'item' | 'divider' | 'label' | 'submenu',
        label?: string,
        value?: string,
        icon?: string,
        items?: ContextMenuItem[],
    } | string

    defineProps({
        items: {
            type: Array as PropType<ContextMenuItem[]>,
            default: () => [],
        },
        defaultIcon: {
            type: String,
            default: '',
        },
    })

    const emit = defineEmits(['click'])
</script>

<style lang="sass" scoped>
</style>