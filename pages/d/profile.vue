<template>
    <NuxtLayout limiter="medium" name="auth-default" pageTitle="Ihr Profil" color="#363E40">
        <HeCard>
            <ProfileCard
                class="rounded-2xl"
                :title="(auth.user?.fullname as string)"
                :image="(auth.user?.profile_image as string)"
                :banner="(auth.user?.profile_banner as string)"
                :subtitle="(auth.user?.username as string)"/>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })

    const auth = useAuthStore()
</script>

<style lang="sass" scoped></style>
