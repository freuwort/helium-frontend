<template>
    <NuxtLayout name="guest-default" pageTitle="Passwort ändern">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Passwort ändern</h1>
                    <p>Bitte ändern Sie Ihr Passwort um sich anzumelden.</p>
    
                    <div class="flex flex-col gap-4">
                        <IodInput v-model="form.password" label="Aktuelles Passwort" type="password"/>
                        <IodInput v-model="form.new_password" show-score :score-function="useZxcvbn()" label="Neues Passwort" type="password"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <IodButton label="Passwort ändern" size="l" corner="pill" :loading="form.processing"/>
                    </div>
    
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
    const auth = useAuthStore()
    const route = useRoute()



    const splashscreen = useSplashscreenStore()
    const form = useForm({
        password: '',
        new_password: '',
    })

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')



    function submit()
    {
        // Prevent submit if form is processing
        if (form.processing) return

        form.patch(auth.apiRoutes.changePassword, { onSuccess })
    }
    
    async function onSuccess()
    {
        splashscreen.start()
    
        await auth.fetchSession()
    
        return navigateTo(redirect.value ?? auth.routes.authHome, {
            replace: true,
            external: !!redirect.value
        })
    }
</script>
