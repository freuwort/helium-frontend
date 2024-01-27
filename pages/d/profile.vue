<template>
    <NuxtLayout name="auth-default" pageTitle="Ihr Profil" color="#363E40">
        <Card>
            <ProfileCard class="radius-xl" :title="auth.user?.fullname" :image="auth.user?.profile_image" :subtitle="auth.user?.username"/>
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
