<template>
    <div class="form-limiter">
        <Card is="form" @submit.prevent="handleLogin">
            <Layout :gap="2" :padding="2">
                <h1 class="weight-medium align-center margin-0">Anmelden</h1>

                <Layout :gap="1">
                    <IodInput type="text" label="Email oder Nutzername" v-model="form.email"/>
                    <IodInput type="password" label="Passwort" v-model="form.password"/>
                </Layout>
                <Layout :gap="1">
                    <IodToggle type="checkbox" label="Angemeldet bleiben" v-model="form.remember"/>
                    <IodButton label="Anmelden" size="large"/>
                </Layout>

                <hr>

                <Layout :gap="1" horizontal>
                    <NuxtLink to="/forgot-password">Passwort vergessen?</NuxtLink>
                    <Spacer />
                    <NuxtLink to="/register">Neues Konto erstellen</NuxtLink>
                </Layout>
            </Layout>
        </Card>
    </div>
</template>

<script lang="ts" setup>
    definePageMeta({
        layout: 'guest-form',
        middleware: 'guest',
    })

    useHead({
        title: 'Anmelden',
    })



    const form = ref({
        email: 'admin@example.com',
        password: 'password',
        remember: false,
    })

    const auth = useAuthStore()

    async function handleLogin()
    {
        // Prevent login if already logged in
        if (auth.isLoggedIn) return

        // Attempt login
        const { error } = await auth.login(form.value)

        // Navigate to dashboard if successful
        if (!error.value) navigateTo('/d')
    }
</script>

<style scoped lang="sass"></style>
