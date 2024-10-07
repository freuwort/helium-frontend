<template>
    <NuxtLayout name="guest-default" pageTitle="Anmeldung bestätigen">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <HeFlex :gap="2" :padding="2">
                    <h1 class="font-medium text-center m-0">{{ form.method ? '2-Faktor bestätigen' : '2-Faktor Methode wählen' }}</h1>
                    
                    <HeDivider />
                    
                    <ErrorAlert :errors="form.errors"/>
    
                    <HeFlex :gap="1" v-if="form.method === 'totp'">
                        <span>Bitte geben Sie Ihren 6-stelligen App-Code ein</span>
                        <IodOtpInput :length="6" :dividers="[3]" v-model="form.code" @complete="submit" autofocus/>
                    </HeFlex>
    
                    <HeFlex :gap="1" v-else-if="form.method === 'sms'">
                        <span>Bitte geben Sie den 6-stelligen Code ein, den wir Ihnen per SMS gesendet haben</span>
                        <IodOtpInput :length="6" :dividers="[3]" v-model="form.code" @complete="submit" autofocus/>
                    </HeFlex>
    
                    <HeFlex :gap="1" v-else-if="form.method === 'email'">
                        <span>Bitte geben Sie den 6-stelligen Code ein, den wir Ihnen per Email gesendet haben</span>
                        <IodOtpInput :length="6" :dividers="[3]" v-model="form.code" @complete="submit" autofocus/>
                    </HeFlex>
    
                    <HeFlex :gap="1" v-else-if="form.method === 'backup'">
                        <span>Bitte geben Sie einen Ihrer 8-stelligen Backup-Codes ein</span>
                        <IodOtpInput :length="8" :charset="backupCodeCharset" v-model="form.code" @complete="submit" autofocus/>
                    </HeFlex>
                    
                    <IodButton label="Anmeldung bestätigen" size="l" v-if="form.method" :loading="form.processing"/>
    
                    <HeFlex v-if="!form.method">
                        <ContextMenuItem is="button" class="radius-m" v-if="auth.user?.has_tfa_totp_method_enabled" icon="screen_lock_portrait" @click="form.method = 'totp'">Authenticator App</ContextMenuItem>
                        <ContextMenuItem is="button" class="radius-m" v-if="auth.user?.has_tfa_sms_method_enabled" icon="sms" @click="form.method = 'sms'">SMS</ContextMenuItem>
                        <ContextMenuItem is="button" class="radius-m" v-if="auth.user?.has_tfa_email_method_enabled" icon="email" @click="form.method = 'email'">Email</ContextMenuItem>
                        <ContextMenuItem is="button" class="radius-m" icon="key" @click="form.method = 'backup'">Backup-Code</ContextMenuItem>
                    </HeFlex>
    
                    <HeDivider />
    
                    <HeFlex :gap="1" horizontal>
                        <a href="#" v-if="form.method" @click="form.method = null">Andere Methode wählen</a>
                        <HeSpacer />
                        <a href="#" class="color-red" @click="auth.logout(redirect)">Anmeldung abbrechen</a>
                    </HeFlex>
                </HeFlex>
            </HeCard>
        </HeLimiter>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const route = useRoute()
    
    

    const backupCodeCharset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    const splashscreen = useSplashscreenStore()
    const form = useForm({
        method: auth.user?.default_tfa_method || null,
        code: '',
    })

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')



    function submit()
    {
        // Prevent submit if form is processing
        if (form.processing) return

        // Prevent submit if no method is selected
        if (!form.method) return
        
        // Prevent submit if already verified
        if (auth.session.tfa_verified) return

        let route = ''

        switch (form.method)
        {
            case 'totp': route = auth.apiRoutes.verifyTfaTotp; break
            case 'sms': route = auth.apiRoutes.verifyTfaSms; break
            case 'email': route = auth.apiRoutes.verifyTfaEmail; break
            case 'backup': route = auth.apiRoutes.verifyTfaBackup; break
        }

        form.post(route, { onSuccess, onError })
    }

    async function onSuccess()
    {
        splashscreen.start()

        await auth.fetchSession()

        return navigateTo(redirect.value ?? auth.routes.authHome, {
            replace: true,
            external: !!redirect.value
        })
    }

    async function onError()
    {
        form.code = ''
    }
</script>
