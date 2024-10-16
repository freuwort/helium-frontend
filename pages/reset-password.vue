<template>
    <NuxtLayout name="guest-default" pageTitle="Passwort wiederherstellen">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent="submit">
                <HeFlex gap="2rem" padding="2rem">
                    <ErrorAlert :errors="form.errors"/>
                    <h1 class="font-medium text-center m-0">Passwort wiederherstellen</h1>

                    <template v-if="validLink === true">
                        <p>
                            Geben Sie ein neues Passwort ein.
                        </p>
        
                        <IodInput type="password" label="Passwort" v-model="form.password"/>
                        <IodButton label="Passwort zurücksetzen" size="l" corner="pill" :disabled :loading="form.processing"/>
                    </template>

                    <template v-else>
                        <IodAlert type="error" text="Dieser Link ist ungültig oder abgelaufen." />
                    </template>
    
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
    const auth = useAuthStore()
    const route = useRoute()



    const form = useForm({
        password: '',
    })

    const linkEmail = computed(() => route.query.email as string ?? null)
    const linkToken = computed(() => route.query.token as string ?? null)
    const validLink = computed(() => !!linkEmail.value && !!linkToken.value)
    const disabled = computed(() => form.processing || !validLink.value)

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')



    function submit()
    {
        if (disabled.value) return

        form
        .transform((data) => {
            return {
                ...data,
                email: linkEmail.value,
                token: linkToken.value
            }
        })
        .post(auth.apiRoutes.resetPassword, { onSuccess })
    }
    
    function onSuccess()
    {
        navigateTo(redirect.value ?? auth.routes.authHome, {
            replace: true,
            external: !!redirect.value
        })
    }
</script>
