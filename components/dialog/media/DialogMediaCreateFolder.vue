<template>
    <IodPopup ref="popup" title="Ordner erstellen">
        <Flex is="form" :padding="1" :gap="1" @submit.prevent="createFolder">
            <ErrorAlert :errors="form.errors" />

            <IodInput label="Name" ref="input" v-model="form.name" />

            <Flex horizontal>
                <IodButton type="button" variant="contained" label="Abbrechen" @click="popup.close()" :loading="form.processing" />
                <Spacer />
                <IodButton type="submit" variant="filled" label="Ordner Erstellen" :loading="form.processing" />
            </Flex>
        </Flex>
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

    async function createFolder() {
        form
        .post('/api/folder', {
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