<template>
    <div class="iod-container iod-table">
        <div class="table-fixture-wrapper">
            <div class="fixture-row">
                <slot name="left"/>

                <div class="flex items-center px-1 gap-1 bg-background-soft rounded-full">
                    <slot name="wrapped-left"/>
                    <HeDivider vertical class="h-6 focused" v-if="$slots['wrapped-left']"/>
                    <VDropdown placement="bottom-start">
                        <IodButton type="button" class="!gap-2 !px-4" size="s" corner="pill" variant="text" label="Filter" icon-left="filter_alt" normal-case/>
                        <template #popper><IodTableFilters :filter="filter" :filterSettings="filterSettings" /></template>
                    </VDropdown>
                    <HeDivider vertical class="h-6 focused" />
                    <IodInput class="search-input " icon-left="search" placeholder="Suchen" v-model="filter.search"/>
                </div>

                <div class="spacer"></div>
                
                <div class="flex items-center p-1 gap-1 bg-background-soft rounded-full">
                    <slot name="wrapped-right"/>
                    <HeDivider vertical class="h-6 focused" v-if="$slots['wrapped-right']"/>
                    <VDropdown>
                        <IodButton type="button" class="!gap-2 !px-4" size="s" corner="pill" variant="text" label="Aktionen" icon-right="arrow_drop_down" normal-case/>
                        <template #popper>
                            <ContextMenu class="min-w-72">
                                <ContextMenuItem v-for="action in globalActions" is="button" v-close-popper :icon="action.icon" :color="action.color" @click="action.run('global')">{{ action.text }}</ContextMenuItem>
                                <template v-if="selectionActions.length">
                                    <ContextMenuDivider />
                                    <ContextMenuLabel :label="`Auswahl – ${ selection.length }`"/>
                                    <ContextMenuItem v-for="action in selectionActions" is="button" v-close-popper :icon="action.icon" :color="action.color" :disabled="!selection.length" @click="action.run('selection', selection)">{{ action.text }}</ContextMenuItem>
                                </template>
                            </ContextMenu>
                        </template>
                    </VDropdown>
                </div>
                
                <slot name="right"/>
            </div>

            <div class="fixture-row" v-if="pagination?.page > 1 || selection.length || filter.search || displayFilter.length">
                <IodButton type="button" normal-case size="xs" corner="pill" color-preset="info" variant="contained" :label='`Seite ${pagination.page}`' v-if="pagination?.page > 1" @click="setPagination({ page: 0 })"/>
                <IodButton type="button" normal-case size="xs" corner="pill" color-preset="info" variant="contained" :label='`Auswahl: ${selection.length}`' v-if="selection.length" @click="deselectAll()" v-tooltip="'Alles abwählen'"/>
                <IodButton type="button" normal-case size="xs" corner="pill" color-preset="info" variant="contained" :label='`Suche nach "${filter.search}"`' v-if="filter.search" @click="filter.search = ''"/>
                <IodButton type="button" normal-case size="xs" corner="pill" color-preset="info" variant="contained" :label="`${item.label}: ${item.value}`" @click="delete filter[item.key]" v-for="item in displayFilter"/>
            </div>

            <IodLoader type="bar" v-show="loading" />
        </div>



        <IodAlert type="placeholder" class="h-72" v-if="!items.length && !loading">
            <div class="flex item-center justify-center h-16 w-16 mx-auto">
                <IodIcon icon="category" class="!text-5xl"/>
            </div>
            Keine Einträge gefunden
        </IodAlert>
        
        <IodAlert type="placeholder" class="h-72" v-if="!items.length && loading">
            <div class="flex item-center justify-center h-16 w-16 mx-auto">
                <IodLoader class="m-auto"/>
            </div>
            Lade Einträge
        </IodAlert>



        <div class="table-inner-wrapper" v-show="items.length">
            <div class="table-head">
                <div class="table-row">
                    <div class="table-column centered w-12">
                        <IodToggle :modelValue="items.length && items.every(item => selection.includes(item.id))" @update:modelValue="$event ? selectAll() : deselectAll()" v-tooltip="'Alle auswählen'" />
                    </div>

                    <div class="table-column" v-for="column in columns" :class="{ 'resizable': column.resizable, 'resizing': getColumnSettings(column).resizing, 'sortable': column.sortable, 'sorted-field': sort.field === column.name, }" :style="`width: ${getColumnSettings(column).width}px;`" @mousedown.exact="toggleColumnSorting(column.name)">
                        <div class="column-sort-indicator">{{ sort.order === 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}</div>
                        <div class="column-label" v-tooltip="column.label">{{ column.label }}</div>
                        <div class="column-resize-handle" @mousedown.stop="resizeColumn($event, column)"></div>
                    </div>
                </div>
            </div>

            <div class="table-body">
                <div class="table-row" v-for="item in items" @click="rowClick(item)">
                    <div class="table-column centered w-12">
                        <IodToggle :modelValue="getSelection.includes(item.id)" @click.stop @update:modelValue="setSelection(item, $event)"/>
                    </div>

                    <div class="table-column" v-for="column in columns" :style="`width: ${getColumnSettings(column).width}px;`">
                        <IodTableColumn :data="getData(item, column)" :monospace="column.monospace"/>
                    </div>

                    <div class="table-column actions">
                        <div class="button-container" @click.stop>
                            <IodIconButton
                                v-for="action in individualActions"
                                class="!w-10"
                                type="button"
                                size="s"
                                corner="pill"
                                variant="contained"
                                :icon="action.icon"
                                :background="action.color"
                                v-tooltip="action.text"
                                @click="action.run('individual', [item.id])"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <div class="table-pagination-wrapper">
            <IodPagination :modelValue="pagination" @update:modelValue="setPagination($event)"/>
            
            <div class="spacer"></div>

            <div class="size-fixture">
                <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'10 Einträge pro Seite'" :variant="pagination.size === 10 ? 'contained' : 'text'" label="10" @click="setPagination({ size: 10 })"/>
                <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'20 Einträge pro Seite'" :variant="pagination.size === 20 ? 'contained' : 'text'" label="20" @click="setPagination({ size: 20 })"/>
                <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'50 Einträge pro Seite'" :variant="pagination.size === 50 ? 'contained' : 'text'" label="50" @click="setPagination({ size: 50 })"/>
                <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'100 Einträge pro Seite'" :variant="pagination.size === 100 ? 'contained' : 'text'" label="100" @click="setPagination({ size: 100 })"/>
                <IodButton type="button" normal-case class="!px-0 !w-11" size="s" corner="pill" v-tooltip="'250 Einträge pro Seite'" :variant="pagination.size === 250 ? 'contained' : 'text'" label="250" @click="setPagination({ size: 250 })"/>
                <HeDivider vertical class="h-6 focused" />
                <IodIconButton type="button" size="s" class="!px-0 !w-11" corner="pill" variant="text" icon="table_edit" v-tooltip="'Ansicht anpassen'" @click="columnPopup.open()"/>
            </div>
        </div>
        


        <IodPopup ref="columnPopup" title="Spalten anpassen" blur="0" backdrop-color="#00000040" max-width="400px" placement="right">
            <div class="customization-wrapper">
                <Container orientation="vertical" lock-axis="y" @drop="applyColumnOrder">
                    <Draggable v-for="columnSetting in columnSettings" :key="columnSetting.name">
                        <div class="customization-row" :class="{'shown': columnSetting.show}">
                            <IodIcon icon="drag_handle" />
                            <span class="label">{{ columnSetting.label }}</span>
                            <IodIconButton
                                type="button"
                                size="s"
                                variant="text"
                                background="inherit"
                                :icon="columnSetting.show ? 'visibility' : 'visibility_off'"
                                v-tooltip="columnSetting.show ? 'Spalte ausblenden' : 'Spalten einblenden'"
                                @click="toggleColumnVisibility(columnSetting.name)"
                            />
                        </div>
                    </Draggable>
                </Container>
            </div>
        </IodPopup>
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
    const columnPopup = ref()
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
    const filter = ref({...props.filter})

    const displayFilter = computed(() => {
        // Get the filter settings;
        let filterSettings = props.filterSettings ?? []

        // Get the filter values
        let filter_ = {...filter.value}

        // Remove empty values
        for (const key in filter_)
        {
            if (!filter_[key]) delete filter_[key]
        }

        // Get the display filter
        let displayFilter = []

        // Loop through the filter
        for (const key in filter_)
        {
            // Get the filter setting
            let setting = filterSettings.find(setting => setting.name === key)

            // If the setting is not found, skip it
            if (!setting) continue

            // Get the value
            let value = filter_[key]

            // If the value is an array, join it
            if (Array.isArray(value)) value = value.join(', ')

            // If the value is a boolean, convert it to a string
            if (typeof value === 'boolean') value = value ? 'An' : 'Aus'

            // If the value is a string, capitalize it
            if (typeof value === 'string') value = capitalizeWords(value)

            // Add the filter to the display filter
            displayFilter.push({
                key,
                label: setting.label,
                value,
            })
        }

        // Return the display filter
        return displayFilter
    })

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
    function setPagination(value: Partial<Pagination>)
    {
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
    .customization-wrapper
        .customization-row
            display: flex
            align-items: center
            height: 3rem
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
            left: 0 !important
            background: var(--color-background-soft)
            border-radius: var(--radius-m)

    .iod-container.iod-table
        display: grid
        grid-template-rows: auto auto
        border-radius: var(--radius-l)

        .table-fixture-wrapper
            position: sticky
            z-index: 200
            top: inherit
            border-radius: inherit
            border-bottom-right-radius: 0
            border-bottom-left-radius: 0
            background: var(--color-background)
            z-index: 2
            padding-block: 1rem
            display: flex
            flex-direction: column
            gap: 1rem
            border-bottom: 1px solid var(--color-border)

            .fixture-row
                padding-inline: 1rem
                display: flex
                align-items: center
                flex-wrap: wrap
                gap: 1rem
                position: relative

            .search-input
                width: 16rem
                height: 2.5rem !important
                background: transparent !important
                border-radius: none !important
                --local-padding: .25rem

            .iod-loader
                position: absolute !important
                height: 2px
                left: 0
                right: 0
                bottom: 0

            .spacer
                flex: 1

        .table-empty-wrapper
            display: flex
            justify-content: center
            align-items: center
            height: 15rem
            padding: 1rem

            .table-empty-text
                font-size: 1rem

        .table-inner-wrapper
            display: grid
            grid-template-rows: auto auto
            overflow: hidden
            overflow-x: auto

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
                min-height: 3rem
                position: relative
                border-bottom: 1px solid var(--color-background-soft)

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
                        padding: .25rem 1rem
                        gap: .25rem
                        background: var(--color-background-soft)
                        transform-origin: right
                        transform: translateX(1rem)
                        transition: all 100ms

                &.sortable:hover
                    .column-sort-indicator
                        color: var(--color-text-soft-disabled)
                        opacity: 1

                &.sortable.sorted-field
                    .column-label
                        padding-left: 2rem

                    .column-sort-indicator
                        color: var(--color-text)
                        transform: translateX(.5rem)
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
                    padding-inline: 1rem
                    font-weight: bold
                    overflow: hidden
                    text-overflow: ellipsis
                    white-space: nowrap
                    color: var(--color-text)
                    transition: padding 100ms
                    will-change: padding

            .table-head
                .table-row
                    height: 3rem
                    border-bottom: 1px solid var(--color-border)

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
            padding: 1rem
            display: flex
            align-items: center
            border-top: 1px solid var(--color-border)

            .spacer
                flex: 1

            .size-fixture
                display: flex
                align-items: center
                gap: .25rem
                padding: .25rem
                height: 2.5rem
                border-radius: 2.5rem
                background: var(--color-background-soft)
</style>