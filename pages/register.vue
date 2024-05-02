<template>
    <NuxtLayout name="guest-form" pageTitle="Registrieren">
        <div class="form-limiter">
            <Card is="form" @submit.prevent="handleRegister">
                <Flex :gap="2" :padding="2">
                    <h1 class="weight-medium align-center margin-0">Registrieren</h1>
    
                    <Flex :gap="1">
                        <IodInput type="text" label="Vorname" v-model="form.firstname"/>
                        <IodInput type="text" label="Nachname" v-model="form.lastname"/>
                        <IodInput type="email" label="Email" v-model="form.email"/>
                        <IodInput type="password" label="Passwort" show-score :score-function="useZxcvbn()" v-model="form.password"/>
                    </Flex>
                    <Flex :gap="1">
                        <IodToggle type="checkbox" v-model="form.terms">
                            <template #label>
                                Ich habe die <a target="_blank" href="/privacy">Datenschutzerklärung</a> und die <a target="_blank" href="/terms">AGB</a> gelesen und akzeptiere diese
                            </template>
                        </IodToggle>
                        <IodButton label="Neues Konto registrieren" size="l"/>
                    </Flex>
    
                    <hr class="margin-0">
    
                    <Flex :gap="1" horizontal>
                        <NuxtLink to="/login">Zurück zur Anmeldung</NuxtLink>
                        <Spacer />
                    </Flex>
                </Flex>
            </Card>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'guest',
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
