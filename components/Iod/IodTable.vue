<template>
    <div class="iod-container iod-table">
        <div class="table-fixture-wrapper">
            <div class="fixture-row">
                <slot name="left"/>

                <IodInput class="search-input " icon-left="search" placeholder="Suchen" v-model="filter.search" clearable/>

                <IodIconButton v-for="action in globalActions" type="button" corner="m" size="s" variant="contained" v-tooltip="action.text" :icon="action.icon" :color-preset="action.color" @click="action.run('global')" />
                
                <HeDivider vertical class="h-6" />

                <IodIconButton v-for="action in selectionActions" type="button" corner="m" size="s" variant="contained" v-tooltip="action.text" :icon="action.icon" :color-preset="action.color" :disabled="!selection.length" @click="action.run('selection', selection)" />
                
                <div class="spacer"></div>

                <slot name="right"/>
                
                <IodIconButton type="button" icon="filter_alt" v-tooltip="'Filter'" size="s" variant="contained" @click="filterOptions.open()"/>
                <IodIconButton type="button" icon="tune" v-tooltip="'Anzeige Optionen'" size="s" variant="contained" @click="displayOptions.open()"/>
            </div>
        </div>



        <IodAlert type="placeholder" class="h-48 mb-auto" v-if="!items.length && !loading">
            <div class="flex item-center justify-center h-16 w-16 mx-auto">
                <IodIcon icon="category" class="!text-5xl"/>
            </div>
            Keine Einträge gefunden
        </IodAlert>
        
        <IodAlert type="placeholder" class="h-48 mb-auto" v-if="!items.length && loading">
            <div class="flex item-center justify-center h-16 w-16 mx-auto">
                <IodLoader class="m-auto"/>
            </div>
            Lade Einträge
        </IodAlert>



        <div class="table-inner-wrapper" v-show="items.length">
            <div class="table-head">
                <div class="table-row">
                    <div class="table-column centered w-12">
                        <IodToggle class="!min-h-8 !p-0" :modelValue="items.length && items.every(item => selection.includes(item.id))" @update:modelValue="$event ? selectAll() : deselectAll()" v-tooltip="'Alle auswählen'" />
                    </div>

                    <div class="table-column" v-for="column in columns" :class="{ 'resizable': column.resizable, 'resizing': getColumnSettings(column).resizing, 'sortable': column.sortable, 'sorted-field': sort.field === column.name, }" :style="`width: ${getColumnSettings(column).width}px;`" @mousedown.exact="toggleColumnSorting(column.name)">
                        <div class="column-sort-indicator">{{ sort.order === 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}</div>
                        <div class="column-label" :aria-label="column.label">{{ column.label }}</div>
                        <div class="column-resize-handle" @mousedown.stop="resizeColumn($event, column)"></div>
                    </div>
                </div>
                <IodLoader type="bar" v-show="loading" />
            </div>

            <div class="table-body">
                <div class="table-row" v-for="item in items" @click="rowClick(item)">
                    <div class="table-column centered w-12">
                        <IodToggle class="!min-h-8 !p-0" :modelValue="getSelection.includes(item.id)" @click.stop @update:modelValue="setSelection(item, $event)"/>
                    </div>

                    <div class="table-column" v-for="column in columns" :style="`width: ${getColumnSettings(column).width}px;`">
                        <IodTableColumn :data="getData(item, column)" :monospace="column.monospace"/>
                    </div>

                    <div class="table-column actions">
                        <div class="button-container" @click.stop>
                            <IodIconButton
                                v-for="action in individualActions"
                                type="button"
                                size="s"
                                corner="s"
                                variant="text"
                                :icon="action.icon"
                                :color-preset="action.color"
                                v-tooltip.end="action.text"
                                @click="action.run('individual', [item.id])"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <div class="table-pagination-wrapper">
            <IodPagination :modelValue="pagination" @update:modelValue="setPagination($event)"/>
        </div>
        


        <IodTableDisplayOptions
            ref="displayOptions"
            :pagination="pagination"
            :columnSettings="columnSettings"
            @apply:order="applyColumnOrder"
            @update:pagination="setPagination($event)"
            @update:columnSettings="saveColumnSettings()"
        />
        <IodTableFilters
            ref="filterOptions"
            :filter="filter"
            :filterSettings="filterSettings"
        />
    </div>
</template>

<script lang="ts" setup>
    // @ts-nocheck
    import { Container, Draggable } from 'vue3-smooth-dnd'

    type Column = {
        name: string,
        label: string,
        valuePath?: string,
        transform?: (value: any, item: any) => any,
        width?: number,
        sortable?: boolean,
        resizable?: boolean,
        hideable?: boolean,
        monospace?: boolean,
        default?: string | undefined,
        
        show?: boolean,
        resizing?: boolean,
    }

    type ColumnSetting = {
        name: string,
        label?: string,
        show?: boolean,
        width?: number,
    }

    type Action = {
        icon?: string,
        text?: string,
        color?: string,
        scope: string[],
        isAvailable?: (items: any[]) => boolean,
        run: (context: string, items: (string | number)[]) => void,
    }

    type Item = {
        id: number | string,
        [key: string]: any,
    }

    type Pagination = {
        from: number,
        to: number,
        total: number,
        page: number,
        lastPage: number,
        size: number,
    }

    type Sort = {
        field: string,
        order: 'asc' | 'desc',
    }

    type FilterSettingValue = {
        value: any,
        text: string
    }

    export type FilterSetting = {
        name: string,
        label: string,
        type: 'select',
        multiple: boolean,
        values: FilterSettingValue[] | ComputedRef<FilterSettingValue[]>,
    }



    const props = defineProps({
        columns: {
            type: Array as PropType<Column[]>,
            default: () => [],
        },
        columnSettings: {
            type: Array as PropType<ColumnSetting[]>,
            default: () => [],
        },
        actions: {
            type: Array as PropType<Action[]>,
            default: () => [],
        },
        items: {
            type: Array as PropType<Item[]>,
            default: () => [],
        },
        pagination: {
            type: Object as PropType<Pagination>,
            default: () => ({ from: 0, to: 0, total: 0, page: 1, lastPage: 1, size: 20, }),
        },
        sort: {
            type: Object as PropType<Sort>,
            default: () => ({ field: '', order: '' }),
        },
        filter: Object,
        filterSettings: {
            type: Array as PropType<FilterSetting[]>,
            default: () => [],
        },
        selection: {
            type: Array as PropType<(string | number)[]>,
            default: () => [],
        },
        scope: {
            type: String,
            default: 'generic',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    })

    const emits = defineEmits([
        'update:selection',
        'update:pagination',
        'update:sort',
        'update:filter',
        'update:filterSettings',
        'update:columnSettings',
        'request:refresh',
    ])



    // START: Columns
    const displayOptions = ref()
    const columnSettings = ref<ColumnSetting[]>([])

    const shownColumns = computed<ColumnSetting[]>(() => {
        return columnSettings.value
        .filter(customisation => customisation.show)
    })

    const columns = computed<Column[]>(() => {
        return props.columns
        .filter(column => shownColumns.value.find(shownColumn => shownColumn.name === column.name))
        .sort((a, b) => shownColumns.value.findIndex(shownColumn => shownColumn.name === a.name) - shownColumns.value.findIndex(shownColumn => shownColumn.name === b.name))
    })

    function loadColumnSettings() {
        // Load customizations from saved settings
        columnSettings.value = props.columnSettings.map(column => ({
            name: column.name,
            width: column.width ?? 200,
            show: column.show ?? true,
            resizing: false,
        }))

        for (const i of props.columns) {
            const column = getColumnSettings(i.name)

            // If the column was loaded, add the label
            if (column) column.label = i.label

            // Otherwise add it
            else columnSettings.value.push({
                name: i.name,
                label: i.label,
                width: i.width ?? 200,
                show: i.show ?? true,
                resizing: false,
            })
        }
    }

    function getColumnSettings(columnName: string|Column): ColumnSetting|undefined{
        columnName = typeof columnName === 'string' ? columnName : columnName.name
        return columnSettings.value.find(customisation => customisation.name === columnName)
    }



    function resizeColumn (event: MouseEvent, columnName: string|Column): void {
        let columnSetting = getColumnSettings(columnName)
        let startX = event.clientX
        let startWidth = columnSetting.width

        columnSetting.resizing = true
        
        function mouseMove(event: MouseEvent) {
            let diff = event.clientX - startX
            let newWidth = startWidth + diff
            
            // Limit the width to 80px - 2000px
            columnSetting.width = Math.min(Math.max(newWidth, 80), 2000)
        }

        function mouseUp() {
            document.removeEventListener('mousemove', mouseMove)
            document.removeEventListener('mouseup', mouseUp)

            columnSetting.resizing = false
            saveColumnSettings()
        }

        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
    }

    function applyColumnOrder(dropResult: any) {
        columnSettings.value = applyDrag(columnSettings.value, dropResult)
        saveColumnSettings()
    }

    function toggleColumnVisibility(columnName: string|Column) {
        const column = getColumnSettings(columnName)
        if (!column) return

        column.show = !column?.show
        saveColumnSettings()
    }

    

    function saveColumnSettings() {
        emits('update:columnSettings', columnSettings.value.map(customisation => ({
            name: customisation.name,
            width: customisation.width,
            show: customisation.show,
        })))
    }

    watch(() => props.columns, loadColumnSettings, { immediate: true, deep: true })
    // END: Columns



    // START: Actions
    const globalActions = computed<Action[]>(() => {
        return props.actions.filter((action: Action) => action?.scope?.includes('global'))
    })

    const selectionActions = computed<Action[]>(() => {
        return props.actions.filter((action: Action) => action?.scope?.includes('selection'))
    })
    
    const individualActions = computed<Action[]>(() => {
        return props.actions.filter((action: Action) => action?.scope?.includes('individual'))
    })

    const rowActions = computed<Action[]>(() => {
        return props.actions.filter((action: Action) => action?.scope?.includes('row'))
    })

    function rowClick(item: Item) {
        for (const action of rowActions.value) {
            action.run('row', [item.id])
        }
    }
    // END: Actions



    // START: Selection
    const getSelection = computed(() => {
        return props.selection ?? []
    })

    const setSelection = (item: Item, value: boolean) => {
        let selection = getSelection.value

        if (value)
        {
            if (!selection.includes(item.id))
            {
                selection.push(item.id)
            }
        }
        else
        {
            selection = selection.filter((id) => id !== item.id)
        }

        emits('update:selection', selection)
    }

    const selectAll = () => {
        let selection = []

        for (const item of props.items) {
            selection.push(item.id)
        }

        emits('update:selection', selection)
    }

    const deselectAll = () => {
        emits('update:selection', [])
    }
    // END: Selection



    // START: Filter
    const filterOptions = ref()
    const filter = ref({...props.filter})

    watch(filter, () => { emits('update:filter', filter.value) }, { deep: true })
    // END: Filter



    // START: Sorting
    const columnSorting = computed(() => ({
        field: props.sort?.field ?? '',
        order: props.sort?.order ?? '',
    }))

    function isColumnSortable(columnName: string): boolean {
        return columns.value.find((column: Column) => column.name === columnName)?.sortable ?? false
    }

    function setColumnSorting(columnName: string, order: string): void {
        if (!isColumnSortable(columnName)) return
        
        saveColumnSorting({
            field: columnName,
            order: order,
        })
    }
    
    function toggleColumnSorting(columnName: string): void {
        if (!isColumnSortable(columnName)) return

        saveColumnSorting({
            field: columnName,
            order: columnSorting.value.field === columnName && columnSorting.value.order === 'asc'  ? 'desc' : 'asc'
        })
    }

    function saveColumnSorting(sort: Sort): void {
        emits('update:sort', sort)
    }
    // END: Sorting



    // START: Pagination
    function setPagination(value: Partial<Pagination>) {
        emits('update:pagination', { ...props.pagination, ...value })
    }
    // END: Pagination



    const getData = (item: Item, column: Column) => {
        let path = column?.valuePath?.split('.') ?? []
        let value = item as any
        let data = {
            text: column.default ?? null,
            tooltip: null,
            color: null,
            icon: null,
            image: null,
        }

        for (const part of path)
        {
            if (!value.hasOwnProperty(part))
            {
                value = null
                break
            }

            value = value[part]
        }
        
        if (column.transform)
        {
            let transformedValue = column.transform(value, item)

            if (typeof transformedValue === 'string')
            {
                data.text = transformedValue
            }
            else
            {
                data = {
                    ...data,
                    ...transformedValue,
                }
            }
        }
        else
        {
            data.text = value || column.default || null
        }
        

        return data
    }
</script>

<style lang="sass" scoped>
    .iod-container.iod-table
        display: flex
        flex-direction: column
        border-radius: var(--radius-l)

        .table-fixture-wrapper
            flex: none
            display: flex
            flex-direction: column
            gap: 1rem
            border-radius: inherit
            border-bottom-right-radius: 0
            border-bottom-left-radius: 0
            background: var(--color-background)
            z-index: 2
            padding-bottom: 1rem

            .fixture-row
                display: flex
                align-items: center
                flex-wrap: wrap
                gap: .5rem
                position: relative

            .search-input
                width: 16rem
                height: 2rem !important
                border-radius: none !important
                --local-padding: .25rem

            .spacer
                flex: 1

        .table-inner-wrapper
            flex: 1
            display: grid
            grid-template-rows: auto 1fr
            overflow: auto
            border-bottom: 1px solid var(--color-border)

            &::-webkit-scrollbar
                width: 3px
                height: 3px

            &::-webkit-scrollbar-track
                background: var(--color-background)

            &::-webkit-scrollbar-thumb
                background: #00000050
                border-radius: 0
                background-clip: content-box
                border: 0

                &:hover
                    background: var(--color-text-soft)
                    border: 0
                    border-radius: 0

            .table-row
                display: flex
                align-items: center
                height: 2rem
                position: relative
                border-bottom: 1px solid var(--color-border)

                &:last-child
                    border-bottom: none

            .table-column
                display: flex
                align-items: center
                justify-content: flex-start
                user-select: none
                position: relative

                &.resizable
                    .column-resize-handle
                        pointer-events: all

                    &:hover
                        background: var(--color-background-soft)

                &.resizing
                    background: var(--color-background-soft)

                    .column-resize-handle
                        opacity: 1 !important

                &.centered
                    justify-content: center

                &.actions
                    flex: 1
                    justify-content: flex-end
                    position: sticky
                    right: 0
                    z-index: 100
                    opacity: 0
                    overflow: hidden
                    transition: all 100ms

                    .button-container
                        display: flex
                        align-items: center
                        // background: var(--color-background-soft)
                        backdrop-filter: blur(7px)
                        transform-origin: right
                        transform: translateX(1rem)
                        transition: all 100ms

                &.sortable:hover
                    .column-label
                        padding-left: 1rem

                    .column-sort-indicator
                        color: var(--color-text-soft-disabled)
                        opacity: 1

                &.sortable.sorted-field
                    .column-label
                        padding-left: 1.5rem

                    .column-sort-indicator
                        color: var(--color-text)
                        transform: translateX(.25rem)
                        opacity: 1

                .column-sort-indicator
                    position: absolute
                    left: 0
                    top: 0
                    bottom: 0
                    width: 1rem
                    font-family: var(--font-icon)
                    font-size: 1.25rem
                    display: flex
                    align-items: center
                    justify-content: center
                    user-select: none
                    pointer-events: none
                    opacity: 0
                    transition: all 100ms
                    will-change: opacity, color, transform

                .column-resize-handle
                    position: absolute
                    z-index: 10
                    top: 0
                    bottom: 0
                    right: 0
                    width: 1rem
                    transform: translateX(50%)
                    cursor: col-resize
                    pointer-events: none
                    opacity: 0

                    &::after
                        content: ''
                        position: absolute
                        top: 0
                        bottom: 0
                        right: 50%
                        width: 3px
                        transform: translateX(50%)
                        background: var(--color-text)
                        pointer-events: none

                    &:hover
                        opacity: 1

                .column-label
                    padding-inline: .5rem
                    font-weight: 600
                    overflow: hidden
                    text-overflow: ellipsis
                    white-space: nowrap
                    color: var(--color-text)
                    transition: padding 100ms
                    will-change: padding

            .table-head
                position: sticky
                z-index: 100
                top: 0
                background: var(--color-background)

                .iod-loader
                    position: absolute !important
                    height: 2px
                    left: 0
                    right: 0
                    bottom: 0

                .table-row
                    height: 2rem
                    
                    .table-column
                        height: 100%

                        &.actions
                            background: none

            .table-body
                .table-row
                    &:hover
                        background-color: var(--color-background-soft)

                        .table-column.actions
                            opacity: 1

                            .button-container
                                transform: translateX(0)

                    .table-column
                        align-self: stretch



        .table-pagination-wrapper
            flex: none
            display: flex
            align-items: center
            justify-content: start
            padding-top: 1rem
</style>