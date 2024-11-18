<template>
    <NuxtLayout name="guest-default" pageTitle="Passwort ändern">
        <form class="contents" @submit.prevent="submit">
            <div class="flex flex-col items-start min-h-10">
                <IodButton type="button" size="xs" variant="text" corner="pill" color-preset="error" icon-left="logout" label="Anmeldung abbrechen" normal-case @click="auth.logout(intendedQuery)" />
                <h1 class="font-medium m-0">Passwort ändern</h1>
            </div>
    
            <ErrorAlert :errors="form.errors"/>
            
            <IodAlert>
                <p>Bitte ändern Sie Ihr Passwort um sich anzumelden.</p>
            </IodAlert>
    
            <div class="flex flex-col gap-4">
                <IodInput v-model="form.password" label="Aktuelles Passwort" type="password"/>
                <IodInput v-model="form.new_password" show-score :score-function="useZxcvbn()" label="Neues Passwort" type="password"/>
            </div>
            
            <IodButton label="Passwort ändern" size="l" corner="pill" :loading="form.processing"/>
        </form>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const intendedQuery = useIntended()
    const splashscreen = useSplashscreenStore()

    const form = useForm({
        password: '',
        new_password: '',
    })

    function submit() {
        if (form.processing) return

        form.patch(auth.apiRoutes.changePassword, { onSuccess })
    }
    
    async function onSuccess() {
        splashscreen.start()
        await auth.fetchSession()
        await domain.fetchSettings()
        return navigateTo(auth.routes.authHome+intendedQuery, { replace: true })
    }
</script>
