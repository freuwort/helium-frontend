<template>
    <IodPopup ref="popup" title="Template Nachricht">
        <HeFlex is="form" padding="1.5rem" gap="1.5rem" @submit.prevent="send()">
            <div class="flex flex-col gap-2">
                <IodInput prefix="Empfänger:&nbsp;" placeholder="vorausgewählt" disabled />
                <IodInput prefix="CC:&nbsp;" v-model="cc" />
                <IodInput prefix="BCC:&nbsp;" v-model="bcc" />
                <IodInput prefix="Betreff:&nbsp;" v-model="subject">
                    <template #right>
                        <VDropdown placement="bottom-end">
                            <IodIconButton type="button" size="s" icon="data_object" variant="text" v-tooltip="'Vorlage auswählen'"/>

                            <template #popper>
                                <ContextMenu class="min-w-64">
                                    <ContextMenuItem class="!min-h-10" :icon="getIconFromType(template.type)" v-for="template in templates" @click="subject += template.template">{{ template.name ?? template.template }}</ContextMenuItem>
                                </ContextMenu>
                            </template>
                        </VDropdown>
                    </template>
                </IodInput>
            </div>

            <textarea class="w-full h-40 p-2 px-4 bg-background-soft rounded-lg" v-model="message" placeholder="Nachricht" />

            <IodButton class="w-full" type="submit" size="l" label="senden"/>
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    type TemplateType = 'text' | 'number' | 'email' | 'date' | 'html'

    type Templates = {
        template: string
        type: TemplateType
        name?: string
        description?: string
    }

    const props = defineProps({
        templates: Object as PropType<Templates[]>,
    })



    const popup = ref()
    const keys = ref([] as string[]|number[])
    const cc = ref('')
    const bcc = ref('')
    const subject = ref('')
    const message = ref('')
    const attachments = ref([])



    function open(items: string[]|number[])
    {
        keys.value = items
        
        popup.value.open()
    }

    function send()
    {
        emits('send', {
            ids: keys.value,
            cc: cc.value,
            bcc: bcc.value,
            subject: subject.value,
            message: message.value,
            attachments: attachments.value
        })

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