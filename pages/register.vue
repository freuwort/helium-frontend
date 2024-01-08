<template>
    <div class="form-limiter">
        <Card is="form" @submit.prevent="handleRegister">
            <Layout :gap="2" :padding="2">
                <h1 class="weight-medium align-center margin-0">Registrieren</h1>

                <Layout :gap="1">
                    <IodInput type="text" label="Vorname" v-model="form.firstname"/>
                    <IodInput type="text" label="Nachname" v-model="form.lastname"/>
                    <IodInput type="email" label="Email" v-model="form.email"/>
                    <IodInput type="password" label="Passwort" show-password-score :password-score-function="zxcvbn" v-model="form.password"/>
                </Layout>
                <Layout :gap="1">
                    <IodToggle type="checkbox" v-model="form.terms">
                        <template #label>
                            Ich habe die <a target="_blank" href="/privacy">Datenschutzerklärung</a> und die <a target="_blank" href="/terms">AGB</a> gelesen und akzeptiere diese
                        </template>
                    </IodToggle>
                    <IodButton label="Neues Konto registrieren" size="large"/>
                </Layout>

                <hr>

                <Layout :gap="1" horizontal>
                    <NuxtLink to="/login">Zurück zur Anmeldung</NuxtLink>
                    <Spacer />
                </Layout>
            </Layout>
        </Card>
    </div>
</template>

<script lang="ts" setup>
    import zxcvbn from 'zxcvbn'

    definePageMeta({
        layout: 'guest-form',
        middleware: 'guest',
    })

    useHead({
        title: 'Registrieren',
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
        if (auth.isLoggedIn) return

        // Attempt register
        const { error } = await auth.register(form.value)

        // Navigate to dashboard if successful
        if (!error.value) navigateTo('/d')
    }
</script>

<style scoped lang="sass"></style>
