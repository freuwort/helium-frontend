<template>
    <NuxtLayout name="guest-default" pageTitle="Passwort vergessen?">
        <form class="contents" @submit.prevent="submit">
            <div class="flex flex-col items-start min-h-10">
                <IodButton size="xs" variant="text" corner="pill" icon-left="west" label="Zurück zur Anmeldung" normal-case :is="NuxtLink" :to="auth.routes.login+intendedQuery" />
                <h1 class="font-medium m-0">Passwort vergessen</h1>
            </div>
    
            <ErrorAlert :errors="form.errors"/>
    
            <div class="flex flex-col gap-4" v-if="sent === false">
                <p>
                    Wenn Sie Ihr Passwort vergessen haben, können Sie eine Email mit einem Link zum Zurücksetzen Ihres Passworts beantragen.<br>
                    Geben Sie hierzu die <b>Email-Adresse Ihres Kontos</b> ein:
                </p>
    
                <IodInput type="email" label="Email" v-model="form.email"/>
                <IodButton label="Zurücksetzungslink anfordern" size="l" corner="pill" :disabled :loading="form.processing"/>
            </div>
            
            <IodAlert type="success" v-else>
                Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts an Ihre Email-Adresse gesendet!<br>
                <b>Bitte schauen Sie auch in Ihrem Spam- oder Junk-Ordner.</b>
            </IodAlert>
        </form>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const intendedQuery = useIntended()
    const NuxtLink = defineNuxtLink({})

    const sent = ref(false)
    const form = useForm({
        email: '',
    })

    const disabled = computed(() => form.processing || !form.email)

    function submit() {
        if (disabled.value) return

        form.post(auth.apiRoutes.forgotPassword, { onSuccess })
    }
    
    function onSuccess() {
        sent.value = true
        form.reset()
    }
</script>
