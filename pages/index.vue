<template>
    <NuxtLayout name="auth-default" pageTitle="Startseite">
        <HeCard>
            <div class="flex flex-col gap-6 p-6">
                <div class="flex items-center">
                    <SettingsTitle class="flex-1">Schnelle Aktionen</SettingsTitle>
                    <HeSpacer/>
                    <IodButton :is="NuxtLink" size="s" variant="text" to="/settings" icon-right="chevron_right" label="Einstellungen" />
                </div>
                <div class="flex gap-6">
                    <IodButton :is="NuxtLink" class="flex-1 !h-20" size="l" variant="contained" to="/users" background="var(--bg-indigo-600)" icon-left="group" label="Nutzer" />
                    <IodButton :is="NuxtLink" class="flex-1 !h-20" size="l" variant="contained" to="/roles" background="var(--bg-indigo-600)" icon-left="badge" label="Rolle" />
                    <IodButton :is="NuxtLink" class="flex-1 !h-20" size="l" variant="contained" to="/events" background="var(--bg-emerald-600)" icon-left="local_activity" label="Event" />
                </div>
            </div>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: ['auth', '2fa-verified'],
    })

    const NuxtLink = defineNuxtLink({})
</script>

<style lang="sass" scoped></style>
