<template>
    <NuxtLayout name="guest-form" pageTitle="Passwort wiederherstellen">
        <div class="form-limiter">
            <Card is="form" @submit.prevent>
                <Flex :gap="2" :padding="2">
                    <h1 class="weight-medium align-center margin-0">Passwort wiederherstellen</h1>
    
                    <IodInput type="email" label="Email"/>
                    <IodButton label="Passwort wiederherstellen" size="l"/>
    
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
        layout: 'guest-form',
    })
</script>
