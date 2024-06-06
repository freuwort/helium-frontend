<template>
    <IodPopup ref="popup" title="Template Nachricht">
        <HeFlex is="form" padding="1.5rem" gap="1.5rem" @submit.prevent="send()">
            <div class="flex flex-col gap-2">
                <IodInput prefix="Empfänger:&nbsp;" placeholder="vorausgewählt" disabled />
                <IodInput prefix="CC:&nbsp;" v-model="form.cc" />
                <IodInput prefix="BCC:&nbsp;" v-model="form.bcc" />
                <IodInput prefix="Betreff:&nbsp;" v-model="form.subject">
                    <template #right>
                        <VDropdown placement="bottom-end">
                            <IodIconButton type="button" size="s" icon="data_object" variant="text" v-tooltip="'Vorlage auswählen'"/>
                            
                            <template #popper>
                                <ContextMenu class="min-w-64">
                                    <ContextMenuItem class="!min-h-10" :icon="getIconFromType(template.type)" v-for="template in templates" @click="form.subject += template.template">{{ template.name ?? template.template }}</ContextMenuItem>
                                </ContextMenu>
                            </template>
                        </VDropdown>
                    </template>
                </IodInput>
            </div>
            
            <textarea class="w-full h-40 p-2 px-4 bg-background-soft rounded-lg" v-model="form.message" placeholder="Nachricht" />
            
            <IodInput prefix="Anhänge:&nbsp;" :modelValue="form.attachments.join(', ')" placeholder="keine" disabled>
                <template #right>
                    <IodIconButton type="button" size="s" icon="close" variant="text" v-tooltip="'Anhänge entfernen'" @click="form.attachments = []" v-show="form.attachments.length"/>
                    <IodIconButton type="button" size="s" icon="attach_file" variant="text" v-tooltip="'Dateien auswählen'" @click="filePicker.open()"/>
                </template>
            </IodInput>
            
            <IodButton class="w-full" type="submit" size="l" label="senden"/>
        </HeFlex>
    </IodPopup>

    <DialogMediaPicker ref="filePicker" @select="form.attachments = $event" type="file" multiple/>
</template>

<script lang="ts" setup>
    type TemplateType = 'text' | 'number' | 'email' | 'date' | 'html'

    type Templates = {
        template: string
        type: TemplateType
        name?: string
        description?: string
    }

    defineProps({
        templates: Object as PropType<Templates[]>,
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