<template>
    <IodPopup ref="popup" title="2FA einrichten" max-width="500px" @close="emit('close')">
        <HeFlex is="form" gap="2.5rem" padding="1.5rem" @submit.prevent="enableTotp" v-show="setup == 'totp'">
            <HeFlex class="bg-background-soft rounded-lg">
                <div class="h-48 aspect-square flex items-center justify-center mx-auto my-2 rounded bg-background overflow-hidden">
                    <img class="w-full h-full object-cover" :src="totpSetupForm.qr" alt="QR-Code" v-if="!totpSetupForm.processing"/>
                    <IodLoader v-else/>
                </div>
                <HeDivider />
                <IodInput type="text" label="Geheimnis" readonly :modelValue="!totpSetupForm.processing ? totpSetupForm.secret : ''">
                    <template #right>
                        <IodIconButton type="button" icon="content_copy" variant="text" corner="pill" size="s" v-tooltip="'Geheimnis kopieren'"/>
                    </template>
                </IodInput>
            </HeFlex>
            
            <HeFlex gap=".5rem" padding=".75rem 0 .5rem">
                <p class="m-0"><code>[1]</code> Scannen Sie den <b>QR-Code</b> mit Ihrer <b>Authenticator-App</b></p>
                <p class="m-0"><code>[2]</code> Geben Sie den <b>6-stelligen Code</b> aus Ihrer App ein.</p>
                <p class="m-0"><code>[3]</code> Klicken Sie auf <b>"Code Bestätigen"</b></p>
            </HeFlex>
            
            <HeFlex gap="1rem">
                <ErrorAlert :errors="totpSetupForm.errors"/>
                <IodOtpInput :length="6" :dividers="[3]" v-model="totpSetupForm.code" @complete="enableTotp"/>
                <IodButton label="Code Bestätigen" corner="pill" size="l"/>
            </HeFlex>
        </HeFlex>


        <HeFlex gap="2.5rem" padding="1.5rem" v-show="setup == 'backup'">
            <ErrorAlert :errors="backupCodesForm.errors"/>
            <p class="m-0">
                Mit diesen Backup-Codes können Sie sich in Ihren Account einloggen, wenn andere 2FA-Methoden nicht funktionieren.<br>
                <b>Bitte legen Sie diese an einem sicheren Ort ab.</b>
            </p>
            <HeFlex class="bg-background-soft rounded-2xl">
                <HeFlex horizontal padding="1rem" class="border-b">
                    <IodButton type="button" icon-left="refresh" label="Neue Codes generieren" size="s" corner="pill" variant="text" normal-case :loading="backupCodesForm.processing" @click="regenerateBackup"/>
                    <HeSpacer />
                </HeFlex>
                <code class="flex justify-center flex-wrap gap-4 p-4 py-8 bg-transparent">
                    <span v-for="code in backupCodesForm.codes" :key="code">{{ code }}<br></span>
                </code>
            </HeFlex>
            <HeFlex horizontal gap="1rem">
                <IodButton type="button" class="flex-1" corner="pill" variant="contained" label="Schließen" @click="popup.close()"/>
                <IodButton type="button" class="flex-1" corner="pill" variant="filled" label="Codes kopieren" @click="copyBackup()"/>
            </HeFlex>
        </HeFlex>


        <HeFlex gap="2.5rem" padding="1.5rem" v-show="setup == 'success'">
            <p class="m-0">
                Die Einrichtung der Zwei Faktor Authentifizierung war erfolgreich!<br>
                <b>Sie sollten nun Ihre Backup-Codes speichern und sicher aufbewahren.</b>
            </p>
            <HeFlex horizontal gap="1rem">
                <IodButton type="button" class="flex-1" corner="pill" variant="contained" label="Schließen" @click="popup.close()"/>
                <IodButton type="button" class="flex-1" corner="pill" variant="filled" label="Codes Anzeigen" @click="showBackup()"/>
            </HeFlex>
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'
    const auth = useAuthStore()

    const popup = ref()
    const setup = ref('totp')

    const emit = defineEmits(['close', 'success'])



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
        totpSetupForm.reset()

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
                emit('success')
                showSuccess()
            }
        })
    }
    // END: Setup TOTP



    // START: Show setup success
    function showSuccess()
    {
        setup.value = 'success'
        popup.value.open()
    }
    // END: Show setup success



    // START: Setup backup codes
    const backupCodesForm = useForm({
        codes: [],
    })

    function showBackup()
    {
        setup.value = 'backup'
        popup.value.open()
        backupCodesForm.reset()

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

    function copyBackup()
    {
        navigator.clipboard.writeText(backupCodesForm.codes.join('\n'))
        toast.success('Codes wurden kopiert!')
    }
    // END: Setup backup codes



    defineExpose({
        setupTotp,
        showBackup,
    })
</script>

<style lang="sass" scoped></style>