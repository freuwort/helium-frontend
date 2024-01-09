<template>
    <NuxtLayout name="guest-form" title="Anmelden">
        <div class="form-limiter">
            <Card is="form" @submit.prevent="handleLogin">
                <Flex :gap="2" :padding="2">
                    <h1 class="weight-medium align-center margin-0">Anmelden</h1>
    
                    <Flex :gap="1">
                        <IodInput type="text" label="Email oder Nutzername" v-model="form.email"/>
                        <IodInput type="password" label="Passwort" v-model="form.password"/>
                    </Flex>
                    <Flex :gap="1">
                        <IodToggle type="checkbox" label="Angemeldet bleiben" v-model="form.remember"/>
                        <IodButton label="Anmelden" size="large"/>
                    </Flex>
    
                    <hr>
    
                    <Flex :gap="1" horizontal>
                        <NuxtLink to="/forgot-password">Passwort vergessen?</NuxtLink>
                        <Spacer />
                        <NuxtLink to="/register">Neues Konto erstellen</NuxtLink>
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
