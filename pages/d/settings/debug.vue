<template>
    <form class="contents" @submit.prevent="triggerStatus()">
        <SettingsTitle>Debug Options</SettingsTitle>
        <SettingsRow title="Trigger status" description="Trigger a status code">
            <IodInput class="flex-1" type="number" v-model="form.status" />
        </SettingsRow>
        <SettingsRow>
            <IodButton class="flex-1" label="Trigger" :loading="form.processing" />
        </SettingsRow>
    </form>
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
