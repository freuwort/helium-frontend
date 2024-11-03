<template>
    <NuxtLayout name="guest-default" pageTitle="Ihr Konto ist gesperrt">
        <HeLimiter size="form">
            <HeCard>
                <div class="flex flex-col px-6 py-6 gap-6 sm:gap-8 sm:py-8">
                    <h1 class="font-medium text-center m-0">Ihr Konto ist gesperrt</h1>
                    
                    <div>
                        <p>Grund: <b>{{ auth.user?.block_reason || 'Nicht angegeben' }}</b></p>
                        <p>Bitte wenden Sie sich an einen Administrator.</p>
                    </div>
    
                    <HeDivider />
    
                    <div class="flex flex-col gap-y-2 sm:items-center sm:flex-row">
                        <HeSpacer />
                        <a href="#" class="color-red" @click="auth.logout(redirect)">Anmeldung abbrechen</a>
                    </div>
                </div>
            </HeCard>
        </HeLimiter>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const route = useRoute()

    const redirect = computed(() => route.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')
</script>
