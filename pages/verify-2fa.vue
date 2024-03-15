<template>
    <NuxtLayout name="guest-form" pageTitle="Anmeldung bestätigen">
        <div class="form-limiter">
            <Card is="form" @submit.prevent="handleLogin">
                <Flex :gap="2" :padding="2">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="weight-medium align-center margin-0">Anmeldung bestätigen</h1>
                    <Flex :gap="1">
                        <p class="margin-0">
                            Bitte geben Sie den 6-stelligen Code aus Ihrer Authenticator-App ein.
                            <i>Lorem ipsum dolor sit amet consectetur adipisicing elit.</i>
                        </p>
                        <IodOtpInput :length="6" :dividers="[3]" v-model="form.otp" autofocus/>
                    </Flex>
                    <Flex :gap="1">
                        <IodButton label="Anmeldung bestätigen" size="large" :loading="form.processing"/>
                    </Flex>
    
                    <hr>
    
                    <Flex :gap="1" horizontal>
                        <NuxtLink to="/">Andere Methode wählen</NuxtLink>
                        <Spacer />
                        <NuxtLink to="/" class="color-red">Anmeldung abbrechen</NuxtLink>
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
        otp: '',
    })

    function handleLogin()
    {
        // Prevent login if already logged in
        if (auth.session.authenticated) return

        // Attempt login
        form.post(auth.apiRoutes.verify2FA, {
            async onSuccess()
            {
                // Show splashscreen
                splashscreen.start()

                // Fetch user data
                await auth.fetchSession()

                // Navigate to dashboard if successful
                navigateTo(auth.routes.authHome)
            },
        })
    }
</script>
