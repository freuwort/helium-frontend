<template>
    <NuxtLayout name="guest-default" pageTitle="Zwei-Faktor bestätigen">
        <form class="contents" @submit.prevent="submit">
            <div class="flex flex-col items-start min-h-10">
                <IodButton type="button" size="xs" variant="text" corner="pill" color-preset="error" icon-left="logout" label="Anmeldung abbrechen" normal-case @click="auth.logout(intendedQuery)" />
                <h1 class="font-medium m-0">{{ form.method ? 'Zwei-Faktor bestätigen' : 'Methode wählen' }}</h1>
            </div>
            
            <ErrorAlert :errors="form.errors"/>
    
            <HeFlex :gap="1" v-if="form.method === 'totp'">
                <IodAlert>Bitte geben Sie Ihren 6-stelligen App-Code ein</IodAlert>
                <IodOtpInput :length="6" :dividers="[3]" v-model="form.code" @complete="submit" autofocus/>
            </HeFlex>
    
            <HeFlex :gap="1" v-else-if="form.method === 'backup'">
                <IodAlert>Bitte geben Sie einen Ihrer 8-stelligen Backup-Codes ein</IodAlert>
                <IodOtpInput :length="8" :charset="backupCodeCharset" v-model="form.code" @complete="submit" autofocus/>
            </HeFlex>
            
            <HeFlex :gap="1" v-if="form.method">
                <IodButton label="Anmeldung bestätigen" size="l" corner="pill" :loading="form.processing"/>
                <IodButton label="Andere Methode wählen" variant="text" corner="pill" @click="form.method = null"/>
            </HeFlex>
    
            <HeFlex v-if="!form.method">
                <ContextMenuItem is="button" class="rounded-lg" v-if="auth.user?.has_tfa_totp_method_enabled" icon="screen_lock_portrait" @click="form.method = 'totp'">Authenticator App</ContextMenuItem>
                <ContextMenuItem is="button" class="rounded-lg" icon="key" @click="form.method = 'backup'">Backup-Code</ContextMenuItem>
            </HeFlex>
        </form>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const intendedQuery = useIntended()
    const splashscreen = useSplashscreenStore()

    const backupCodeCharset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    const form = useForm({
        method: auth.user?.default_tfa_method || null,
        code: '',
    })

    function submit() {
        if (form.processing) return
        if (!form.method) return

        let route = ''

        switch (form.method)
        {
            case 'totp': route = auth.apiRoutes.verifyTfaTotp; break
            case 'backup': route = auth.apiRoutes.verifyTfaBackup; break
        }

        form.post(route, { onSuccess, onError })
    }

    async function onSuccess() {
        splashscreen.start()
        await auth.fetchSession()
        await domain.fetchSettings()
        return navigateTo(auth.routes.authHome+intendedQuery, { replace: true })
    }

    async function onError() {
        form.code = ''
    }
</script>
