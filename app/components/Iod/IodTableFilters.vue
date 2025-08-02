<template>
    <IodPopup ref="popup" title="Filter" placement="right">
        <div class="flex flex-col p-4 pt-0 gap-4">
            <ContextMenu class="bg-background rounded-lg" v-for="row in filterSettings" :key="row.name">
                <div class="flex items-center pr-2">
                    <ContextMenuLabel class="flex-1" :label="row.label" />
                    <IodButton
                        type="button"
                        variant="text"
                        size="xs"
                        corner="s"
                        label="zurücksetzen"
                        color-preset="info"
                        normal-case
                        @click="resetFilter(row, filter)"
                        v-if="isFilterSet(row, filter)"
                    />
                </div>
                <ContextMenuItem
                    v-for="option in row.values"
                    is="button"
                    type="button"
                    :key="option.value"
                    :label="option.text"
                    :icon="isFilterValueSet(row, filter, option.value) ? 'radio_button_checked' : 'radio_button_unchecked'"
                    :active="isFilterValueSet(row, filter, option.value)"
                    @click="setFilter(row, filter, option.value, !isFilterValueSet(row, filter, option.value))"
                    :tooltip="option.text"
                />
            </ContextMenu>
        </div>
    </IodPopup>
</template>

<script lang="ts" setup>
    const popup = ref()
    const props = defineProps({
        filterSettings: {
            type: Array,
            default: () => [],
        },
        filter: {
            type: Object,
            default: () => ({}),
        },
    })



    // Set filters
    function setFilter(row, filter, value, toggleState) {
        if (row.multiple) {
            if (toggleState) {
                filter[row.name] = filter[row.name] || []
                filter[row.name].push(value)
            }
            else {
                filter[row.name] = filter[row.name].filter(e => e != value)
            }

            filter[row.name] = filter[row.name].length ? filter[row.name] : undefined
        }
        else {
            if (toggleState) {
                filter[row.name] = value
            }
            else {
                filter[row.name] = undefined
            }
        }
    }

    function resetFilter(row, filter) {
        delete filter[row.name]
    }

    function resetAllFilters() {
        for (const row of props.filterSettings) {
            delete filter[row.name]
        }
    }



    // Check for filter state
    function isFilterSet(row, filter) {
        if (row.multiple) {
            return filter[row.name]?.length > 0
        }

        return filter[row.name] !== undefined
    }

    function isFilterValueSet(row, filter, value){
        if (row.multiple) {
            return filter[row.name]?.includes(value)
        }

        return filter[row.name] == value
    }



    // Misc
    function open() {
        popup.value.open()
    }

    defineExpose({
        open,
        setFilter,
        resetFilter,
        resetAllFilters,
        isFilterSet,
        isFilterValueSet,
    })
</script>

<style lang="sass" scoped>
</style>