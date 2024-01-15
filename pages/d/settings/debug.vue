<template>
    <h5 class="margin-0 weight-medium">Debug Options</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Trigger status</span>
            <small>Trigger a status code</small>
        </Flex>
        <form @submit.prevent="triggerStatus()">
            <IodInput type="number" v-model="form.status">
                <template #right>
                    <IodIconButton icon="send" variant="contained" size="small" :loading="form.processing"/>
                </template>
            </IodInput>
        </form>
    </Flex>
    {{ form.validationErrors }}
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const form = useForm({
        status: 403,
    })



    function triggerStatus() {
        form.get('/api/debug/status/'+form.status, {
            onSuccess(data: Object) {
                toast.success('Status triggered')
            },
            onError(error: any) {
                toast.error(error.statusCode+' - '+error.data.message)
            },
        })
    }
</script>

<style lang="sass" scoped></style>
