<template>
    <NuxtLayout name="guest-default" pageTitle="Ihr Konto ist noch nicht freigegeben">
        <div class="flex flex-col items-start min-h-10">
            <IodButton type="button" size="xs" variant="text" corner="pill" color-preset="error" icon-left="logout" label="Anmeldung abbrechen" normal-case @click="auth.logout(intendedQuery)" />
            <h1 class="font-medium m-0">Ihr Konto ist noch nicht freigegeben</h1>
        </div>
        
        <IodAlert>
            <p>Ihr Konto wurde noch nicht freigegeben.<br>Bitte wenden Sie sich an einen Administrator.</p>
        </IodAlert>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const intendedQuery = useIntended()
</script>
