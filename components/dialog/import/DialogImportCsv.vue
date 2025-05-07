<template>
    <IodPopup ref="popup" title="Importieren">
        <HeFlex is="form" padding="1.5rem" gap=".5rem" @submit.prevent="startImport()" id="dialog-csv-import">
            <div class="flex items-center gap-2 p-2 bg-background-soft rounded-full">
                <IodButton
                    type="button"
                    class="!normal-case !tracking-normal !text-sm !h-8"
                    size="s"
                    corner="pill"
                    variant="contained"
                    icon-left="table_chart"
                    border
                    background="var(--bg-emerald-600)"
                    :label="`${filename} (${importer.data.length})`"
                    v-tooltip="`Datei: ${filename} Zeilen: ${importer.data.length}`"
                    @click="select()"
                />
                <HeSpacer />
                <IodToggle class="!h-8 !min-h-0 !rounded-full border !p-0 !px-4" style="border-color: var(--color-border-focused);" prepend-label="Kopfzeile" v-model="importer.hasHeader"/>
                <IodInput class="!h-8 !min-h-0 !w-32 !rounded-full border" style="border-color: var(--color-border-focused);" prefix="Trenner&nbsp;" v-model="importer.delimiter" @update:modelValue="importer.setData(raw)"/>
            </div>

            <HeDivider class="my-4"/>

            <template v-for="item in importer.fields">
                <template v-if="(item instanceof FieldGroup)">
                    <b class="text-lg mt-2">{{ item.label }}</b>
                    <div class="flex items-center gap-4" v-for="field in item.fields">
                        <span class="flex-1">{{ field.label }}</span>
                        <IodIcon icon="chevron_right"/>
                        <div class="flex-1">
                            <VDropdown placement="bottom-start" container="#dialog-csv-import">
                                <IodButton
                                    normal-case
                                    type="button"
                                    size="s"
                                    corner="pill"
                                    color-preset="info"
                                    icon-right="arrow_drop_down"
                                    :border="!importer.getMapping(field.name)"
                                    :variant="importer.getMapping(field.name) ? 'filled' : 'text'"
                                    :label="importer.getMapping(field.name) || 'Spalte auswählen'"
                                />
                                <template #popper>
                                    <ContextMenu class="min-w-72 max-h-96">
                                        <ContextMenuItem is="button" icon="do_not_disturb_on" v-close-popper @click="importer.setMapping(field.name, '')">Auswahl entfernen</ContextMenuItem>
                                        <ContextMenuDivider />
                                        <ContextMenuItem is="button" v-for="header in headerOptions" :key="header.value" icon="label" v-close-popper @click="importer.setMapping(field.name, header.value)">{{ header.text }}</ContextMenuItem>
                                    </ContextMenu>
                                </template>
                            </VDropdown>
                        </div>
                    </div>
                </template>

                <div class="flex items-center gap-4" v-else-if="(item instanceof Field)">
                    <span class="flex-1">{{ item.label }}</span>
                    <IodIcon icon="arrow_forward"/>
                    <div class="flex-1">
                        <VDropdown placement="bottom-start" container="#dialog-csv-import">
                            <IodButton
                                normal-case
                                type="button"
                                size="s"
                                corner="pill"
                                color-preset="info"
                                icon-right="arrow_drop_down"
                                :border="!importer.getMapping(item.name)"
                                :variant="importer.getMapping(item.name) ? 'filled' : 'text'"
                                :label="importer.getMapping(item.name) || 'Spalte auswählen'"
                            />
                            <template #popper>
                                <ContextMenu class="min-w-72">
                                    <ContextMenuItem is="button" icon="do_not_disturb_on" v-close-popper @click="importer.setMapping(item.name, '')">Auswahl entfernen</ContextMenuItem>
                                    <ContextMenuDivider />
                                    <ContextMenuItem is="button" v-for="header in headerOptions" :key="header.value" icon="label" v-close-popper @click="importer.setMapping(item.name, header.value)">{{ header.text }}</ContextMenuItem>
                                </ContextMenu>
                            </template>
                        </VDropdown>
                    </div>
                </div>
            </template>

            <HeDivider class="my-4"/>

            <IodButton class="ml-auto" type="submit" size="l" corner="pill" icon-right="send" label="Importieren"/>
        </HeFlex>

        <input class="hidden" ref="input" type="file" @change="load()" accept=".csv">
    </IodPopup>
</template>

<script lang="ts" setup>
    import { CsvImport, FieldGroup, Field } from '~/classes/import/CsvImport'

    const props = defineProps({
        fields: {
            type: Array as PropType<FieldGroup[]|Field[]>,
            default: () => []
        }
    })



    const emits = defineEmits(['import'])
    defineExpose({select, open})



    const popup = ref()
    const input = ref()
    const filename = ref('')
    const raw = ref('')
    const importer = ref(new CsvImport())
    const headerOptions = computed(() => importer.value.headers.map((e) => ({text: e, value: e})))


    
    function select()
    {
        input.value.click()
    }

    function load()
    {
        let file = input.value.files[0]
        let reader = new FileReader()

        if(!file) return

        filename.value = file.name

        reader.onload = (e) => {
            raw.value = e.target?.result as string
            open(raw.value)
        }

        reader.readAsText(file)

        input.value.value = null
    }

    function open(csv: string)
    {
        importer.value.setData(csv)
        popup.value.open()
    }

    function startImport()
    {
        emits('import', importer.value.applyMapping())
        popup.value.close()
    }



    watch(props.fields, () => (importer.value.fields = props.fields || []), { immediate: true, deep: true })
</script>

<style lang="sass" scoped></style>