<script lang="ts" setup>
    definePageMeta({
        layout: 'guest-form',
    });
</script>

<template>
    <div class="form-limiter">
        <Card is="form" @submit.prevent>
            <Layout :gap="2" :padding="2">
                <h1 class="weight-medium align-center margin-0">Anmelden</h1>

                <Layout :gap="1">
                    <IodInput type="email" label="Email oder Nutzername"/>
                    <IodInput type="password" label="Passwort"/>
                </Layout>
                <Layout :gap="1">
                    <IodToggle type="checkbox" label="Angemeldet bleiben"/>
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

<style scoped lang="sass"></style>
