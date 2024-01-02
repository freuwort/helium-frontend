<script lang="ts" setup>
    import zxcvbn from 'zxcvbn'

    definePageMeta({
        layout: 'guest-form',
    })
</script>

<template>
    <div class="form-limiter">
        <Card is="form" @submit.prevent>
            <Layout :gap="2" :padding="2">
                <h1 class="weight-medium align-center margin-0">Registrieren</h1>

                <Layout :gap="1">
                    <IodInput type="text" label="Vorname"/>
                    <IodInput type="text" label="Nachname"/>
                    <IodInput type="email" label="Email"/>
                    <IodInput type="password" label="Passwort" show-password-score :password-score-function="zxcvbn"/>
                </Layout>
                <Layout :gap="1">
                    <IodToggle type="checkbox">
                        <template #label>
                            Ich habe die <a target="_blank" href="/privacy">Datenschutzerklärung</a> und die <a target="_blank" href="/privacy">AGB</a> gelesen und akzeptiere diese
                        </template>
                    </IodToggle>
                    <IodButton label="Neues Konto registrieren" size="large"/>
                </Layout>

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
