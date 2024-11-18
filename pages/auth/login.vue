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
                <NuxtLink :to="auth.routes.forgotPassword+intendedQuery">Passwort vergessen</NuxtLink>
                <HeSpacer class="hidden sm:block"/>
                <NuxtLink v-if="domain.policy('allow_registration')" :to="auth.routes.register+intendedQuery">Neues Konto erstellen</NuxtLink>
            </div>
        </form>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const domain = useDomainStore()
    const splashscreen = useSplashscreenStore()
    const intendedQuery = useIntended()

    const form = useForm({
        email: '',
        password: '',
        remember: false,
    })

    function submit() {
        if (form.processing) return

        form.post(auth.apiRoutes.login, { onSuccess })
    }
    
    async function onSuccess() {
        splashscreen.start()
        await auth.fetchSession()
        await domain.fetchSettings()
        return navigateTo(auth.routes.authHome+intendedQuery, { replace: true })
    }
</script>
