<template>
    <NuxtLayout name="guest-default" pageTitle="Email-Adresse nicht bestätigt">
        <HeLimiter size="form">
            <HeCard>
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Ihre Email-Adresse ist noch nicht bestätigt</h1>
                    
                    <p>
                        Wir haben Ihnen eine Bestätigungsmail zugesendet.<br>
                        <b>Schauen Sie auch in Ihrem Spam- oder Junk-Ordner.</b>
                    </p>

                    <p>
                        Wenn Sie keine Email erhaltet haben, können Sie die Bestätigungsmail erneut anfordern:
                    </p>

                    <IodButton :label="disabled ? `Erneut anfordern in ${timer}s` : 'Bestätigungsmail erneut anfordern'" corner="pill" variant="contained" :disabled :loading="form.processing" @click="resend"/>
    
                    <HeDivider />
    
                    <div class="flex flex-col gap-y-2 sm:items-center sm:flex-row">
                        <HeSpacer />
                        <a href="#" class="color-red" @click="auth.logout(redirect)">Anmeldung abbrechen</a>
                    </div>
                </div>
            </HeCard>
        </HeLimiter>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'

    const auth = useAuthStore()
    const route = useRoute()



    const form = useForm({})

    const redirect = computed(() => route.query.redirect as string ?? null)
    const disabled = computed(() => timer.value > 0 || tries.value > 10 || form.processing)


    
    // START: Timer
    const timer = ref(0)
    const tries = ref(0)

    onMounted(() => {
        setInterval(() => { if (timer.value > 0){ timer.value-- } }, 1000)
    })

    function startTimer()
    {
        tries.value++
        timer.value = tries.value * 30
    }
    // END: Timer

    function resend()
    {
        if (disabled.value) return

        form.post('/email/verification-notification', { onSuccess })
    }
    
    function onSuccess()
    {
        startTimer()
        toast.success('E-Mail wurde verschickt.')
    }
</script>
