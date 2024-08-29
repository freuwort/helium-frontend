<template>
    <NuxtLayout name="guest-default" pageTitle="Registrieren">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="handleRegister">
                <HeFlex :gap="2" :padding="2">
                    <h1 class="font-medium text-center m-0">Registrieren</h1>
    
                    <HeFlex :gap="1">
                        <IodInput type="text" label="Vorname" v-model="form.firstname"/>
                        <IodInput type="text" label="Nachname" v-model="form.lastname"/>
                        <IodInput type="email" label="Email" v-model="form.email"/>
                        <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password"/>
                    </HeFlex>
                    <HeFlex :gap="1">
                        <IodToggle type="checkbox" v-model="form.terms">
                            <template #label>
                                Ich habe die <a target="_blank" href="/privacy">Datenschutzerklärung</a> und die <a target="_blank" href="/terms">AGB</a> gelesen und akzeptiere diese
                            </template>
                        </IodToggle>
                        <IodButton label="Neues Konto registrieren" size="l"/>
                    </HeFlex>
    
                    <HeDivider />
    
                    <HeFlex :gap="1" horizontal>
                        <NuxtLink to="/login">Zurück zur Anmeldung</NuxtLink>
                        <HeSpacer />
                    </HeFlex>
                </HeFlex>
            </HeCard>
        </HeLimiter>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: ['guest'],
    })

    

    const form = ref({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        terms: false,
    })

    const auth = useAuthStore()

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
