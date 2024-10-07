<template>
    <NuxtLayout name="guest-default" pageTitle="Ihr Konto ist deaktiviert">
        <HeLimiter size="form">
            <HeCard>
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Ihr Konto ist deaktiviert</h1>
                    
                    <div>
                        <p>Ihr Konto ist deaktiviert oder wurde noch nicht freigegeben.</p>
                        <p>Bitte wenden Sie sich an einen Administrator.</p>
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
    const domain = useDomainStore()
    const route = useRoute()



    const splashscreen = useSplashscreenStore()
    const form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')



    function submit()
    {
        // Prevent submit if form is processing
        if (form.processing) return

        // Prevent submit if already logged in
        if (auth.session.authenticated) return

        form.post(auth.apiRoutes.login, { onSuccess })
    }
    
    async function onSuccess()
    {
        splashscreen.start()
    
        await auth.fetchSession()
        await domain.fetchSettings()
    
        if (auth.session.tfa_enabled && !auth.session.tfa_verified)
        {
            return navigateTo(auth.routes.verify2FA+redirectQuery.value)
        }
    
        return navigateTo(redirect.value ?? auth.routes.authHome, {
            replace: true,
            external: !!redirect.value
        })
    }
</script>
