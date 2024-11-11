<template>
    <NuxtLayout name="guest-default" pageTitle="Passwort wiederherstellen">
        <form class="contents" @submit.prevent="submit">
            <div class="flex flex-col items-start min-h-10">
                <IodButton size="xs" variant="text" corner="pill" icon-left="west" label="Zurück zur Anmeldung" normal-case :is="NuxtLink" :to="'/auth/login'+redirectQuery" />
                <h1 class="font-medium m-0">Passwort wiederherstellen</h1>
            </div>
    
            <ErrorAlert :errors="form.errors"/>
    
            <div class="flex flex-col gap-4" v-if="validLink === true">
                <IodAlert text="Geben Sie ein neues Passwort ein."/>
                <IodInput type="password" label="Passwort" v-model="form.password"/>
                <IodButton label="Passwort zurücksetzen" size="l" corner="pill" :disabled :loading="form.processing"/>
            </div>
    
            <template v-else>
                <IodAlert type="error" text="Dieser Link ist ungültig oder abgelaufen." />
            </template>
        </form>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const route = useRoute()
    const NuxtLink = defineNuxtLink({})



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
