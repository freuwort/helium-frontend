<template>
    <NuxtLayout name="guest-default" pageTitle="Ihr Konto ist gesperrt">
        <div class="flex flex-col items-start min-h-10">
            <IodButton type="button" size="xs" variant="text" corner="pill" color-preset="error" icon-left="logout" label="Anmeldung abbrechen" normal-case @click="auth.logout(redirect)" />
            <h1 class="font-medium m-0">Ihr Konto ist gesperrt</h1>
        </div>
        
        <IodAlert>
            <p>Grund: <b>{{ auth.user?.block_reason || 'Nicht angegeben' }}</b></p>
            <p>Bei Fragen wenden Sie sich an einen Administrator.</p>
        </IodAlert>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const route = useRoute()

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')
</script>
