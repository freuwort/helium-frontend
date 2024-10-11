<template>
    <IodPopup ref="popup" title="2FA einrichten">
        <HeFlex is="form" padding="1.5rem" gap="1.5rem">
            <!-- TODO: extract UI from profile -->
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()

    const popup = ref()
    const setup = ref('totp')



    // START: Setup TOTP
    const totpSetupForm = useForm({
        qr: '',
        secret: '',
        code: '',
    })

    function setupTotp()
    {
        setup.value = 'totp'
        popup.value.open()

        totpSetupForm.put('/api/user/two-factor/totp/setup', {
            onSuccess(data: any) {
                totpSetupForm.defaults(data).reset()
            }
        })
    }

    function enableTotp()
    {
        totpSetupForm.put('/api/user/two-factor/totp/enable', {
            onSuccess() {
                auth.fetchSession()
                showSetupSuccess()
            }
        })
    }
    // END: Setup TOTP



    // START: Show setup success
    function showSetupSuccess()
    {
        setup.value = 'success'
        popup.value.open()
    }
    // END: Show setup success



    // START: Setup backup codes
    const backupCodesForm = useForm({
        codes: [],
    })

    function setupBackup()
    {
        setup.value = 'backup'
        popup.value.open()

        backupCodesForm.get('/api/user/two-factor/backup/show', {
            onSuccess(data: any) {
                backupCodesForm.defaults(data).reset()
            }
        })
    }

    function regenerateBackup()
    {
        backupCodesForm.post('/api/user/two-factor/backup/generate', {
            onSuccess(data: any) {
                backupCodesForm.defaults(data).reset()
            }
        })
    }
    // END: Setup backup codes



    defineExpose({
        setupTotp,
        enableTotp,
        setupBackup,
        regenerateBackup
    })
</script>

<style lang="sass" scoped></style>