<template>
    <IodPopup ref="popup" title="Ordner erstellen">
        <HeFlex is="form" padding="1.5rem" gap="2.5rem" @submit.prevent="createDirectory">
            <ErrorAlert :errors="form.errors" />

            <IodInput label="Name" ref="input" v-model="form.name" />

            <HeFlex horizontal gap="1rem">
                <IodButton type="button" class="flex-1" corner="pill" variant="contained" label="Abbrechen" @click="popup.close()" :loading="form.processing" />
                <IodButton type="submit" class="flex-1" corner="pill" variant="filled" label="Ordner Erstellen" :loading="form.processing" />
            </HeFlex>
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    const popup = ref()
    const input = ref()
    const form = useForm({
        path: '',
        name: 'Neuer Ordner',
    })

    function open(path: string) {
        form.defaults({ path }).reset()
        popup.value.open()
        input.value.focus()
        nextTick(() => input.value.input.select())
    }

    async function createDirectory() {
        form
        .post('/api/directory', {
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