<template>
    <NuxtLayout name="guest-default" pageTitle="Anmelden">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <HeFlex :gap="2" :padding="2">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Anmelden</h1>
    
                    <HeFlex :gap="1">
                        <IodInput type="text" label="Email oder Nutzername" v-model="form.email"/>
                        <IodInput type="password" label="Passwort" v-model="form.password"/>
                    </HeFlex>
                    <HeFlex :gap="1">
                        <IodToggle type="checkbox" label="Angemeldet bleiben" v-model="form.remember"/>
                        <IodButton label="Anmelden" size="l" corner="pill" :loading="form.processing"/>
                    </HeFlex>
    
                    <HeDivider />
    
                    <HeFlex :gap="1" horizontal>
                        <NuxtLink :to="'/forgot-password'+redirectQuery">Passwort vergessen?</NuxtLink>
                        <HeSpacer />
                        <NuxtLink :to="'/register'+redirectQuery">Neues Konto erstellen</NuxtLink>
                    </HeFlex>
                </HeFlex>
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
        email: 'admin@example.com',
        password: 'password',
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
