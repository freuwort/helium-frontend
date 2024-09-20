<template>
    <NuxtLayout name="guest-default" pageTitle="Anmelden">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Anmelden</h1>
    
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Email oder Nutzername" v-model="form.email"/>
                        <IodInput type="password" label="Passwort" v-model="form.password"/>
                    </div>
                    <div class="flex flex-col gap-2">
                        <IodToggle type="checkbox" label="Angemeldet bleiben" v-model="form.remember"/>
                        <IodButton label="Anmelden" size="l" corner="pill" :loading="form.processing"/>
                    </div>
    
                    <HeDivider />
    
                    <div class="flex flex-col gap-y-2 sm:items-center sm:flex-row">
                        <NuxtLink :to="'/forgot-password'+redirectQuery">Passwort vergessen?</NuxtLink>
                        <HeSpacer class="hidden sm:block"/>
                        <NuxtLink :to="'/register'+redirectQuery">Neues Konto erstellen</NuxtLink>
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
    


    definePageMeta({
        middleware: ['guest'],
    })



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
