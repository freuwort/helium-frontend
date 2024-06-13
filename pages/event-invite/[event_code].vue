<template>
    <NuxtLayout limiter="form" name="auth-default" pageTitle="Event Einladung" color="#10b981">
        <HeCard>
            <EventInviteCard class="rounded-xl" :code="(code as string)">
                <template #claim="{ loading, claim }">
                    <div class="flex flex-col gap-4">
                        <IodAlert color-preset="info">
                            <b class="text-lg mb-2">Einladung verknüpfen</b>
                            <span class="mb-4">Um diese Einladung anzunehmen, müssen Sie diese mit Ihrem Account verknüpfen.</span>
                            <IodButton class="w-full" type="button" label="Einladung mit Account verknüpfen" color-preset="info" :loading="loading" @click="claim()"/>
                        </IodAlert>
                    </div>
                </template>

                <template #form="{ invite, loading, updateDetails }">
                    <IodInput label="Name" v-model="form.name" />
                    <IodFileInput label="Logo" v-model="form.logo"/>
                    <IodButton type="button" label="Speichern" :loading="loading" @click="updateDetails(form.data())"/>
                </template>
            </EventInviteCard>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })



    const code = computed(() => (useRoute().params.event_code ?? null))

    const form = useForm({
        name: '',
        logo: null,
    })
</script>

<style lang="sass" scoped></style>
