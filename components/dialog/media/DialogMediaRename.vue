<template>
    <IodPopup ref="popup" title="Umbenennen">
        <HeFlex is="form" padding="1.5rem" gap="2.5rem" @submit.prevent="rename">
            <ErrorAlert :errors="form.errors" />
            
            <IodInput label="Name" ref="input" v-model="form.name" />

            <HeFlex horizontal gap="1rem">
                <IodButton type="button" class="flex-1" corner="pill" variant="contained" label="Abbrechen" @click="popup.close()" :loading="form.processing" />
                <IodButton type="submit" class="flex-1" corner="pill" variant="filled" label="Umbenennen" :loading="form.processing" />
            </HeFlex>
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'



    const popup = ref()
    const input = ref()
    const form = useForm({
        path: '',
        name: '',
    })

    function open(item: MediaItem) {
        form.path = item.src_path
        form.name = item.name
        
        // Get selection range
        let start = 0
        let end = item.mime_type === 'directory' ? item.name.length : item.name.lastIndexOf('.')

        popup.value.open()

        nextTick(() => {
            input.value.focus()
            input.value.input?.setSelectionRange(start, end)
        })
    }

    async function rename() {
        form.patch('/api/media/rename', {
            onSuccess() {
                form.reset()
                popup.value.close()
                emits('saved')
            }
        })
    }



    const emits = defineEmits(['saved'])
    defineExpose({ open })
</script>

<style lang="sass" scoped>
</style>