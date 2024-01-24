<template>
    <NuxtLayout name="auth-default" pageTitle="Ihr Profil" color="#363E40">
        <Card>
            <ProfileCard class="radius-xl" :user="auth.user ?? {}"/>
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })

    const auth = useAuthStore()
</script>

<style lang="sass" scoped></style>
