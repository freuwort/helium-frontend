<template>
    <NuxtLayout name="guest-form" pageTitle="Anmelden">
        <div class="form-limiter">
            <Card is="form" @submit.prevent="submit">
                <Flex :gap="2" :padding="2">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="weight-medium align-center margin-0">Anmelden</h1>
    
                    <Flex :gap="1">
                        <IodInput type="text" label="Email oder Nutzername" v-model="form.email"/>
                        <IodInput type="password" label="Passwort" v-model="form.password"/>
                    </Flex>
                    <Flex :gap="1">
                        <IodToggle type="checkbox" label="Angemeldet bleiben" v-model="form.remember"/>
                        <IodButton label="Anmelden" size="large" :loading="form.processing"/>
                    </Flex>
    
                    <hr class="margin-0">
    
                    <Flex :gap="1" horizontal>
                        <NuxtLink to="/forgot-password">Passwort vergessen?</NuxtLink>
                        <Spacer />
                        <NuxtLink to="/register">Neues Konto erstellen</NuxtLink>
                    </Flex>
                </Flex>
            </Card>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    


    definePageMeta({
        middleware: 'guest',
    })



    const splashscreen = useSplashscreenStore()
    const form = useForm({
        email: 'admin@example.com',
        password: 'password',
        remember: false,
    })

    function submit()
    {
        // Prevent submit if form is processing
        if (form.processing) return

        // Prevent submit if already logged in
        if (auth.session.authenticated) return

        form.post(auth.apiRoutes.login, {
            async onSuccess()
            {
                splashscreen.start()

                await auth.fetchSession()

                navigateTo(auth.routes.authHome)
            },
        })
    }
</script>
