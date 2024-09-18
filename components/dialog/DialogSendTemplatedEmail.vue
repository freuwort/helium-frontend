<template>
    <IodPopup ref="popup" title="Template Nachricht">
        <HeFlex is="form" padding="1.5rem" gap="1.5rem" @submit.prevent="send()">
            <div class="flex flex-col gap-2">
                <IodInput prefix="Empfänger:&nbsp;" placeholder="vorausgewählt" readonly>
                    <template #right>
                        <IodIconButton type="button" size="s" corner="pill" :icon="expanded ? 'expand_less' : 'expand_more'" variant="text" v-tooltip="'CC und BCC einblenden'" @click="expanded = !expanded"/>
                    </template>
                </IodInput>
                <IodInput prefix="CC:&nbsp;" v-model="form.cc" v-show="expanded"/>
                <IodInput prefix="BCC:&nbsp;" v-model="form.bcc" v-show="expanded"/>
                <IodInput prefix="Betreff:&nbsp;" v-model="form.subject">
                    <template #right>
                        <VDropdown placement="bottom-end">
                            <IodIconButton type="button" size="s" corner="pill" icon="data_object" variant="text" v-tooltip="'Vorlage auswählen'"/>
                            
                            <template #popper>
                                <ContextMenu class="min-w-64">
                                    <ContextMenuItem class="!min-h-10" :icon="getIconFromType(template.type)" v-for="template in templates" @click="form.subject += template.template">{{ template.name ?? template.template }}</ContextMenuItem>
                                </ContextMenu>
                            </template>
                        </VDropdown>
                    </template>
                </IodInput>
                <IodInput prefix="Anhänge:&nbsp;" :modelValue="form.attachments.join(', ')" placeholder="keine" readonly>
                    <template #right>
                        <IodIconButton type="button" size="s" variant="text" corner="pill" icon="close" v-tooltip="'Anhänge entfernen'" @click="form.attachments = []" v-show="form.attachments.length"/>
                        <IodIconButton type="button" size="s" variant="text" corner="pill" icon="attach_file" v-tooltip="'Anhänge auswählen'" @click="filePicker.open()"/>
                    </template>
                </IodInput>
            </div>
            
            <TextEditor v-model="form.message" label="Nachricht" />
            
            <IodButton class="ml-auto" type="submit" size="l" corner="pill" icon-right="send" label="senden"/>
        </HeFlex>
    </IodPopup>

    <DialogMediaPicker ref="filePicker" @select="form.attachments = $event.map((e: MediaItem) => e.src_path)" type="file" multiple/>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'

    type TemplateType = 'text' | 'number' | 'email' | 'date' | 'html'

    export type Template = {
        template: string
        type: TemplateType
        name?: string
        description?: string
    }

    defineProps({
        templates: Object as PropType<Template[]>,
    })



    const popup = ref()
    const filePicker = ref()
    const form = useForm({
        ids: [],
        cc: '',
        bcc: '',
        subject: '',
        message: '',
        attachments: [],
    })
    const expanded = ref(false)



    function open(items: string[]|number[])
    {
        form.reset()
        form.ids = items
        
        popup.value.open()
    }

    function send()
    {
        emits('send', form.data())

        popup.value.close()
    }


    function getIconFromType(type: TemplateType): string
    {
        switch(type)
        {
            case 'text':
                return 'text_fields'
            case 'number':
                return 'numbers'
            case 'email':
                return 'email'
            case 'date':
                return 'date_range'
            case 'html':
                return 'code'
        }
    }



    const emits = defineEmits(['send'])
    defineExpose({ open })
</script>

<style lang="sass" scoped></style>