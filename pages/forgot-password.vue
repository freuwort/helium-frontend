<template>
    <NuxtLayout name="guest-default" pageTitle="Passwort wiederherstellen">
        <HeLimiter size="form">
            <HeCard is="form" @submit.prevent>
                <HeFlex gap="2rem" padding="2rem">
                    <h1 class="font-medium text-center m-0">Passwort wiederherstellen</h1>
    
                    <IodInput type="email" label="Email"/>
                    <IodButton label="Passwort wiederherstellen" size="l"/>
    
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
</script>
