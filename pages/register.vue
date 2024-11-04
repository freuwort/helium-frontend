<template>
    <NuxtLayout name="guest-default" pageTitle="Registrieren">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="handleRegister">
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Registrieren</h1>
    
                    <div class="flex flex-col gap-4">
                        <IodInput type="text" label="Vorname" v-model="form.firstname"/>
                        <IodInput type="text" label="Nachname" v-model="form.lastname"/>
                        <IodInput type="email" label="Email" v-model="form.email"/>
                        <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password"/>
                    </div>
                    <div class="flex flex-col gap-4">
                        <IodToggle type="checkbox" v-model="form.terms">
                            <template #label>
                                Ich habe die <a target="_blank" href="/privacy">Datenschutzerklärung</a> und die <a target="_blank" href="/terms">AGB</a> gelesen und akzeptiere diese
                            </template>
                        </IodToggle>
                        <IodButton label="Neues Konto registrieren" size="l" corner="pill" :loading="form.processing"/>
                    </div>
    
                    <HeDivider />

                    <pre>{{ profiles }}</pre>

                    <IodButton type="button" v-for="profile in profiles.customProfiles.value" :label="profile.name" corner="pill" @click="profiles.toggle(profile)"/>
    
                    <HeFlex :gap="1" horizontal>
                        <NuxtLink to="/login">Zurück zur Anmeldung</NuxtLink>
                        <HeSpacer />
                    </HeFlex>
                </div>
            </HeCard>
        </HeLimiter>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const profiles = useRegisterProfiles()
    
    const form = useForm({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        terms: false,
    })

    async function handleRegister()
    {
        // Prevent register if already logged in
        if (auth.session.authenticated) return

        // // Attempt register
        // const { error } = await auth.register(form.value)

        // // Navigate to dashboard if successful
        // if (!error.value) navigateTo(auth.routes.authHome)
    }
</script>
