<template>
    <NuxtLayout name="guest-default" pageTitle="Email-Adresse nicht bestätigt">
        <div class="flex flex-col items-start min-h-10">
            <IodButton type="button" size="xs" variant="text" corner="pill" color-preset="error" icon-left="logout" label="Anmeldung abbrechen" normal-case @click="auth.logout(intendedQuery)" />
            <h1 class="font-medium m-0">Email nicht bestätigt</h1>
        </div>
        
        <ErrorAlert :errors="form.errors"/>
        
        <IodAlert>
            <p class="mb-2">
                Wir haben Ihnen eine Bestätigungsmail zugesendet.<br>
                <b>Schauen Sie auch in Ihrem Spam- oder Junk-Ordner.</b>
            </p>
            <p>Wenn Sie keine Email erhaltet haben, können Sie die Bestätigungsmail erneut anfordern:</p>
        </IodAlert>

        <IodButton :label="disabled ? `Erneut anfordern in ${timer}s` : 'Bestätigungsmail erneut anfordern'" corner="pill" variant="contained" :disabled :loading="form.processing" @click="resend"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const auth = useAuthStore()
    const intendedQuery = useIntended()

    const form = useForm({})
    const disabled = computed(() => timer.value > 0 || tries.value > 10 || form.processing)
    
    // START: Timer
    const timer = ref(0)
    const tries = ref(0)

    onMounted(() => {
        setInterval(() => { if (timer.value > 0){ timer.value-- } }, 1000)
    })

    function startTimer() {
        tries.value++
        timer.value = tries.value * 30
    }
    // END: Timer

    function resend() {
        if (disabled.value) return

        form.post('/email/verification-notification', { onSuccess })
    }
    
    function onSuccess() {
        startTimer()
        toast.success('E-Mail wurde verschickt.')
    }
</script>
