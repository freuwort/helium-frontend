<template>
    <IodPopup ref="popup" title="Umbenennen">
        <HeFlex is="form" padding="1.5rem" gap="2.5rem" @submit.prevent="rename">
            <ErrorAlert :errors="form.errors" />
            
            <IodInput label="Name" ref="input" v-model="form.name" />

            <HeFlex horizontal gap="1rem">
                <IodButton class="flex-1" type="button" variant="contained" label="Abbrechen" @click="popup.close()" :loading="form.processing" />
                <IodButton class="flex-1" type="submit" variant="filled" label="Umbenennen" :loading="form.processing" />
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
        
        popup.value.open()
        input.value.focus()

        // Get selection range
        let start = 0
        let end = item.mime_type === 'directory' ? item.name.length : item.name.lastIndexOf('.')

        nextTick(() => input.value.input?.setSelectionRange(start, end))
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