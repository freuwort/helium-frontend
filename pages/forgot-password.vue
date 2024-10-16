<template>
    <NuxtLayout name="guest-default" pageTitle="Passwort vergessen?">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <HeFlex gap="2rem" padding="2rem">
                    <h1 class="font-medium text-center m-0">Passwort vergessen?</h1>

                    <template v-if="sent === false">
                        <p>
                            Wenn Sie Ihr Passwort vergessen haben, können Sie eine Email mit einem Link zum Zurücksetzen Ihres Passworts beantragen.
                        </p>
                        <p>
                            Geben Sie hierzu die <b>Email-Adresse Ihres Kontos</b> ein:
                        </p>
        
                        <IodInput type="email" label="Email" v-model="form.email"/>
                        <IodButton label="Zurücksetzungslink anfordern" size="l" corner="pill" :disabled :loading="form.processing"/>
                    </template>

                    <template v-else>
                        <IodAlert type="success">
                            Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts an Ihre Email-Adresse gesendet!<br>
                            <b>Bitte schauen Sie auch in Ihrem Spam- oder Junk-Ordner.</b>
                        </IodAlert>
                    </template>
    
                    <HeDivider />
    
                    <HeFlex :gap="1" horizontal>
                        <NuxtLink to="/login">Zurück zur Anmeldung</NuxtLink>
                        <HeSpacer />
                    </HeFlex>
                </HeFlex>
            </HeCard>
        </HeLimiter>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const route = useRoute()



    const sent = ref(false)
    const form = useForm({
        email: '',
    })

    const disabled = computed(() => form.processing || !form.email)

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')



    function submit()
    {
        if (disabled.value) return

        form.post(auth.apiRoutes.forgotPassword, { onSuccess })
    }
    
    function onSuccess()
    {
        sent.value = true
        form.reset()
    }
</script>
