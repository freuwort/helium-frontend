<template>
    <IodPopup ref="popup" title="Importieren">
        <HeFlex is="form" padding="1.5rem" gap="1.5rem" @submit.prevent="startImport()">
            <div class="flex items-center gap-2 p-2 bg-background-soft rounded-lg">
                <IodButton
                    type="button"
                    class="!normal-case !tracking-normal !text-sm !h-8"
                    size="s"
                    corner="pill"
                    variant="contained"
                    icon-left="table_chart"
                    border
                    background="var(--bg-emerald-600)"
                    :label="filename + ' (' + inputData.length + ')'"
                    v-tooltip="'Datei: ' + filename + ' Zeilen: ' + inputData.length"
                    @click="select()"
                />
                <HeSpacer />
                <IodToggle  class="!h-8 !min-h-8 w-32 !rounded-full bg-zinc-300 border border-zinc-400" prepend-label="Kopfzeile" v-model="hasHeader"/>
                <IodInput class="!h-8 !min-h-8 w-32 !rounded-full !bg-zinc-300 border border-zinc-400" prefix="Trenner&nbsp;»&nbsp;" v-model="delimiter" />
            </div>

            <div class="flex flex-col gap-2">
                <div class="flex items-center gap-4" v-for="value in mapping">
                    <IodInput class="flex-1" :modelValue="value.label" readonly disabled/>
                    <IodIcon icon="double_arrow" />
                    <IodSelect class="flex-1" label="Wert" :options="headerOptions" v-model="value.header"/>
                </div>
            </div>

            <IodButton class="w-full" type="submit" size="l" label="Importieren"/>
        </HeFlex>

        <input class="hidden" ref="input" type="file" @change="selected()" accept=".csv">
    </IodPopup>
</template>

<script lang="ts" setup>
    type ExpectedValue = {
        label: string
        name: string
        header?: string
        default?: any
    }

    const props = defineProps({
        expectedValues: Object as PropType<ExpectedValue[]>,
    })



    const popup = ref()
    const input = ref()
    const filename = ref('')
    const raw = ref('')
    const delimiter = ref(';')
    const hasHeader = ref(true)
    const mapping = ref([] as ExpectedValue[])


    const headers = computed(() => {
        if(!raw.value) return []
        
        let lines = raw.value.split('\n')

        if (!hasHeader.value)
        {
            return lines[0].split(delimiter.value).map((_, index) => (index+1).toString())
        }

        return lines[0].split(delimiter.value)
    })


    const headerOptions = computed(() => {
        let options = headers.value.map((e) => ({text: e, value: e}))

        options.unshift({text: 'Leer lassen', value: ''})

        return options
    })


    const inputData = computed(() => {
        let csv = raw.value
        
        if(!csv) return []

        let lines = csv.split('\n').map(e => e.replaceAll('\r', '')).filter(e => e.length > 0)

        if (hasHeader.value) lines = lines.slice(1)

        return lines.map(line => {
            let values = line.split(delimiter.value)

            return headers.value.reduce((obj: any, header, index) => {
                obj[header] = values[index] ?? ''
                return obj
            }, {})
        })
    })


    const outputData = computed(() => {
        let output = []

        for (const line of inputData.value)
        {
            let obj = {} as any

            for (const e of mapping.value)
            {
                obj[e.name] = line[e.header as string] ?? e.default
            }

            output.push(obj)
        }

        return output
    })


    
    function select()
    {
        input.value.click()
    }

    function selected()
    {
        let file = input.value.files[0]

        if(!file) return

        filename.value = file.name

        let reader = new FileReader()

        reader.onload = (e) => {
            open(e.target?.result as string)
        }

        reader.readAsText(file)

        input.value.value = null
    }

    function open(csv: any)
    {
        raw.value = csv

        buildMapping()
        
        popup.value.open()
    }

    function buildMapping()
    {
        mapping.value = props.expectedValues?.map((e) => ({
            label: e?.label,
            name: e?.name,
            default: e?.default,
            header: '',
        })) as ExpectedValue[]
    }

    function startImport()
    {
        emits('import', outputData.value)

        popup.value.close()
    }



    const emits = defineEmits(['import'])
    defineExpose({ select, open })
</script>

<style lang="sass" scoped></style>