<template>
    <NuxtLayout name="guest-default" pageTitle="Zweiten Faktor einrichten">
        <div class="flex flex-col items-start min-h-10">
            <IodButton type="button" size="xs" variant="text" corner="pill" color-preset="error" icon-left="logout" label="Anmeldung abbrechen" normal-case @click="auth.logout(redirect)" />
            <h1 class="font-medium m-0">Zweiten Faktor einrichten</h1>
        </div>
        
        <IodAlert>
            <p>Ihr Konto setzt eine Zwei Faktor Authentifizierung voraus.<br><b>Bitte richten Sie jetzt einen zweiten Faktor zur Anmeldung ein.</b></p>
        </IodAlert>

        <IodButton label="Zweiten Faktor einrichten" size="l" corner="pill" @click="twoFactorSetup.setupTotp()"/>

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
