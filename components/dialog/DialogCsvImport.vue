<template>
    <IodPopup ref="popup" title="Importieren">
        <HeFlex is="form" padding="1.5rem" gap=".5rem" @submit.prevent="startImport()">
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
                        <IodIcon icon="double_arrow" />
                        <IodSelect class="flex-1" label="Wert" :options="headerOptions" :modelValue="importer.getMapping(field.name)" @update:modelValue="importer.setMapping(field.name, $event)"/>
                    </div>
                </template>

                <div class="flex items-center gap-4" v-else>
                    <span class="flex-1">{{ item.label }}</span>
                    <IodIcon icon="double_arrow" />
                    <IodSelect class="flex-1" label="Wert" :options="headerOptions" :modelValue="importer.getMapping(item.name)" @update:modelValue="importer.setMapping(item.name, $event)"/>
                </div>
            </template>

            <HeDivider class="my-4"/>

            <IodButton class="ml-auto" type="submit" size="l" corner="pill" icon-right="send" label="Importieren"/>
        </HeFlex>

        <input class="hidden" ref="input" type="file" @change="load()" accept=".csv">
    </IodPopup>
</template>

<script lang="ts" setup>
    import { CsvImport, FieldGroup, Field } from '~/classes/import/CsvImport.ts'

    const props = defineProps({
        fields: {
            type: Array as FieldGroup[]|Field[],
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
    const headerOptions = computed(() => [
        {text: 'Leer lassen', value: ''},
        ...importer.value.headers.map((e) => ({text: e, value: e}))
    ])


    
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