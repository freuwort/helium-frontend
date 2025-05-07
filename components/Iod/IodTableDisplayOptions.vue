<template>
    <IodPopup ref="popup" title="Anzeige Optionen" placement="right">
        <div class="flex flex-col p-4 pt-0 gap-4">
            <ContextMenu class="bg-background rounded-lg">
                <ContextMenuLabel label="Einträge pro Seite" />
                <ContextMenuItem
                    v-for="size in paginationSizes"
                    :key="size"
                    is="button"
                    type="button"
                    :label="`${size} Einträge pro Seite`"
                    :icon="pagination.size === size ? 'radio_button_checked' : 'radio_button_unchecked'"
                    :active="pagination.size === size"
                    @click="$emit('update:pagination', { size })"
                />
            </ContextMenu>

            <ContextMenu class="bg-background rounded-lg customization-wrapper">
                <ContextMenuLabel label="Spalten anpassen" />
                <Container orientation="vertical" lock-axis="y" behaviour="contain" @drop="$emit('apply:order', $event)">
                    <Draggable v-for="columnSetting in columnSettings" :key="columnSetting.name">
                        <div class="customization-row" :class="{'shown': columnSetting.show}">
                            <IodIcon icon="drag_handle" />
                            <span class="label">{{ columnSetting.label }}</span>
                            <IodIconButton
                                type="button"
                                size="s"
                                corner="m"
                                variant="text"
                                :icon="columnSetting.show ? 'visibility' : 'visibility_off'"
                                v-tooltip="columnSetting.show ? 'Ausblenden' : 'Einblenden'"
                                :label="columnSetting.label"
                                :active="columnSetting.show"
                                @click="columnSetting.show = !columnSetting.show"
                            />
                        </div>
                    </Draggable>
                </Container>
            </ContextMenu>
        </div>
    </IodPopup>
</template>

<script lang="ts" setup>
    // @ts-nocheck
    import { Container, Draggable } from 'vue3-smooth-dnd'

    const popup = ref()
    const paginationSizes = [10, 20, 50, 100, 250]

    const props = defineProps({
        pagination: {
            type: Object,
            default: () => ({}),
        },
        columnSettings: {
            type: Array,
            default: () => [],
        },
    })

    const emit = defineEmits([
        'update:pagination',
        'update:columnSettings',
        'apply:order',
    ])

    // Misc
    function open() {
        popup.value.open()
    }
    
    defineExpose({
        open,
    })
    
    watch(() => props.columnSettings, () => emit('update:columnSettings'), { deep: true })
</script>

<style lang="sass" scoped>
    .customization-wrapper
        position: relative
        
        .customization-row
            display: flex
            align-items: center
            height: 2.5rem
            padding-inline: .5rem
            padding-block: .25rem
            gap: .5rem
            user-select: none
            color: var(--color-text-soft-disabled)

            &.shown
                color: var(--color-text-soft)

            .iod-icon
                height: 2rem
                width: 2rem
                color: var(--color-text-soft-disabled)
                font-size: 1.25rem

            .label
                flex: 1
                color: inherit
                font-weight: 600

        .smooth-dnd-ghost
            left: 1rem !important
            background: var(--color-background-soft)
            border-radius: var(--radius-m)
</style>