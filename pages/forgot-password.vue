<script lang="ts" setup>
    definePageMeta({
        layout: 'guest-form',
    })

    useHead({
        title: 'Passwort wiederherstellen',
    })
</script>

<template>
    <div class="form-limiter">
        <Card is="form" @submit.prevent>
            <Layout :gap="2" :padding="2">
                <h1 class="weight-medium align-center margin-0">Passwort wiederherstellen</h1>

                <IodInput type="email" label="Email"/>
                <IodButton label="Passwort wiederherstellen" size="large"/>

                <hr>

                <Layout :gap="1" horizontal>
                    <NuxtLink to="/login">Zurück zur Anmeldung</NuxtLink>
                    <Spacer />
                </Layout>
            </Layout>
        </Card>
    </div>
</template>

<style scoped lang="sass"></style>
