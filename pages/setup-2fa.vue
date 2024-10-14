<template>
    <NuxtLayout name="guest-default" pageTitle="Zweiten Faktor einrichten">
        <HeLimiter size="form">
            <HeCard>
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <h1 class="font-medium text-center m-0">Zweiten Faktor einrichten</h1>
                    
                    <p class="text-center">
                        Ihr Konto setzt eine Zwei Faktor Authentifizierung voraus.<br>
                        <b>Bitte richten Sie jetzt einen zweiten Faktor zur Anmeldung ein.</b>
                    </p>

                    <IodButton label="Zweiten Faktor einrichten" size="l" corner="pill" @click="twoFactorSetup.setupTotp()"/>
    
                    <HeDivider />
    
                    <div class="flex flex-col gap-y-2 sm:items-center sm:flex-row">
                        <HeSpacer />
                        <a href="#" class="color-red" @click="auth.logout(redirect)">Anmeldung abbrechen</a>
                    </div>
                </div>
            </HeCard>
        </HeLimiter>

        <DialogSetupTwoFactor ref="twoFactorSetup" @success="success"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const route = useRoute()
    const splashscreen = useSplashscreenStore()



    const twoFactorSetup = ref()
    const redirect = computed(() => route.query.redirect as string ?? null)



    async function success() {
        splashscreen.start()

        await auth.fetchSession()

        navigateTo(redirect.value ?? auth.routes.authHome, {
            replace: true,
            external: !!redirect.value,
        })
    }
</script>
