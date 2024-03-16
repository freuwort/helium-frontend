<template>
    <NuxtLayout name="guest-form" pageTitle="Anmeldung bestätigen">
        <div class="form-limiter">
            <Card is="form" @submit.prevent="submit">
                <Flex :gap="2" :padding="2">
                    <h1 class="weight-medium align-center margin-0">{{ form.method ? '2-Faktor bestätigen' : '2-Faktor Methode wählen' }}</h1>
                    
                    <hr class="margin-0">
                    
                    <ErrorAlert :errors="form.errors"/>

                    <Flex :gap="1" v-if="form.method === 'totp'">
                        <span>Bitte geben Sie Ihren 6-stelligen App-Code ein</span>
                        <IodOtpInput :length="6" :dividers="[3]" v-model="form.code" @complete="submit" autofocus/>
                    </Flex>

                    <Flex :gap="1" v-else-if="form.method === 'sms'">
                        <span>Bitte geben Sie den 6-stelligen Code ein, den wir Ihnen per SMS gesendet haben</span>
                        <IodOtpInput :length="6" :dividers="[3]" v-model="form.code" @complete="submit" autofocus/>
                    </Flex>

                    <Flex :gap="1" v-else-if="form.method === 'email'">
                        <span>Bitte geben Sie den 6-stelligen Code ein, den wir Ihnen per Email gesendet haben</span>
                        <IodOtpInput :length="6" :dividers="[3]" v-model="form.code" @complete="submit" autofocus/>
                    </Flex>

                    <Flex :gap="1" v-else-if="form.method === 'backup'">
                        <span>Bitte geben Sie einen Ihrer 8-stelligen Backup-Codes ein</span>
                        <IodOtpInput :length="8" :charset="backupCodeCharset" v-model="form.code" @complete="submit" autofocus/>
                    </Flex>
                    
                    <IodButton label="Anmeldung bestätigen" size="large" v-if="form.method" :loading="form.processing"/>

                    <Flex v-if="!form.method">
                        <ContextMenuItem is="button" class="radius-m" v-if="auth.user?.has_tfa_totp_method_enabled" icon="screen_lock_portrait" @click="form.method = 'totp'">Authenticator App</ContextMenuItem>
                        <ContextMenuItem is="button" class="radius-m" v-if="auth.user?.has_tfa_sms_method_enabled" icon="sms" @click="form.method = 'sms'">SMS</ContextMenuItem>
                        <ContextMenuItem is="button" class="radius-m" v-if="auth.user?.has_tfa_email_method_enabled" icon="email" @click="form.method = 'email'">Email</ContextMenuItem>
                        <ContextMenuItem is="button" class="radius-m" icon="key" @click="form.method = 'backup'">Backup-Code</ContextMenuItem>
                    </Flex>
    
                    <hr class="margin-0">
    
                    <Flex :gap="1" horizontal>
                        <a href="#" v-if="form.method" @click="form.method = null">Andere Methode wählen</a>
                        <Spacer />
                        <a href="#" class="color-red" @click="auth.logout">Anmeldung abbrechen</a>
                    </Flex>
                </Flex>
            </Card>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: ['auth', '2fa-needed'],
    })
    
    

    const backupCodeCharset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    
    const auth = useAuthStore()
    const splashscreen = useSplashscreenStore()
    const form = useForm({
        method: auth.user?.default_tfa_method || null,
        code: '',
    })

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

        form.post(route, {
            async onSuccess()
            {
                splashscreen.start()

                await auth.fetchSession()

               navigateTo(auth.routes.authHome)
            },
            onError()
            {
                form.code = ''
            },
        })
    }
</script>
