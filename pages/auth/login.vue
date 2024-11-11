<template>
    <NuxtLayout name="guest-default" pageTitle="Anmelden">
        <form class="contents" @submit.prevent="submit">
            <ErrorAlert :errors="form.errors"/>
            
            <h1 class="font-medium text-center m-0">Anmelden</h1>
    
            <div class="flex flex-col gap-4">
                <IodInput type="text" label="Email oder Nutzername" v-model="form.email"/>
                <IodInput type="password" label="Passwort" v-model="form.password"/>
                <IodToggle type="checkbox" label="Angemeldet bleiben" v-model="form.remember"/>
            </div>
            <div class="flex flex-col gap-4">
                <IodButton label="Anmelden" size="l" corner="pill" :loading="form.processing"/>
            </div>
    
            <HeDivider />
    
            <div class="flex flex-col gap-y-2 sm:items-center sm:flex-row">
                <NuxtLink :to="'/auth/forgot-password'+redirectQuery">Passwort vergessen</NuxtLink>
                <HeSpacer class="hidden sm:block"/>
                <NuxtLink :to="'/auth/register'+redirectQuery">Neues Konto erstellen</NuxtLink>
            </div>
        </form>
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
