<template>
    <div class="relative overflow-hidden" v-if="invite">
        <div class="flex flex-col justify-end h-56 bg-background-soft">
            <div class="flex flex-col justify-end p-4 gap-2 gradient">
                <h2 class="m-0">{{ invite.event.name }}</h2>
                <div class="flex flex-col gap-1">
                    <small class="flex items-center gap-2" v-if="invite.event.start_at || invite.event.end_at">
                        <IodIcon class="!text-sm" icon="event"/>
                        {{ toLocalDate(invite.event.start_at, 'DD.MM.YYYY') }}
                        <span v-if="invite.event.start_at && invite.event.end_at">–</span>
                        {{ toLocalDate(invite.event.end_at, 'DD.MM.YYYY') }}
                    </small>
                    <small class="flex items-center gap-2" v-if="invite.event.main_address">
                        <IodIcon class="!text-sm" icon="location_on"/>
                        {{ invite.event.main_address.full_address }}
                    </small>
                    <small class="flex items-center gap-2" v-if="invite.user">
                        <IodIcon class="!text-sm" icon="person"/>
                        {{ invite.user.name }}
                    </small>
                </div>
            </div>
        </div>

        <div class="flex flex-col p-4 border-t">
            <div class="flex items-center gap-2" v-if="!invite.user && invite.needs_claim">
                <slot name="claim" :invite="invite" :loading="loading" :claim="claim"/>
            </div>

            <div class="flex items-center gap-2" v-else>
                <b class="flex-1 text-lg">Teilnahme</b>
                <IodButtonGroup>
                    <IodIconButton type="button" :loading="loading" v-tooltip="'nicht teilnehmen'" icon="close" color-preset="error" :variant="invite.status === 'rejected' ? 'filled' : 'contained'" @click="updateStatus('rejected')" />
                    <IodIconButton type="button" :loading="loading" v-tooltip="'unter Vorbehalt'" icon="question_mark" color-preset="warning" :variant="invite.status === 'maybe' ? 'filled' : 'contained'" @click="updateStatus('maybe')" />
                    <IodIconButton type="button" :loading="loading" v-tooltip="'teilnehmen'" icon="check" color-preset="success" :variant="invite.status === 'accepted' ? 'filled' : 'contained'" @click="updateStatus('accepted')" />
                </IodButtonGroup>
            </div>
        </div>
        
        <div class="flex flex-col gap-2 p-4 border-t" v-if="['accepted', 'maybe'].includes(invite.status) && invite.form">
            <slot name="form" :invite="invite" :loading="loading" :updateDetails="updateDetails"/>
        </div>

        <div class="flex flex-col gap-2 p-4 border-t small-scrollbar overflow-scroll">
            <pre v-html="JSON.stringify(invite, null, 2)"></pre>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        code: {
            type: String,
            default: null,
        }
    })



    const loading = ref(false)
    const invite = ref(null)

    async function fetch()
    {
        loading.value = true
        invite.value = (await useAxios().get('/api/event-invite/'+props.code)).data.data
        loading.value = false
    }

    async function claim()
    {
        loading.value = true
        await useAxios().patch('/api/event-invite/'+props.code+'/claim')
        await fetch()
    }

    async function updateStatus(status: 'accepted' | 'rejected' | 'maybe')
    {
        loading.value = true
        await useAxios().patch('/api/event-invite/'+props.code+'/status', { status })
        await fetch()
    }

    async function updateDetails(data: any)
    {
        loading.value = true
        await useAxios().patch('/api/event-invite/'+props.code+'/details', data)
        await fetch()
    }

    

    watch(() => props.code, fetch, { immediate: true })
</script>

<style lang="sass" scoped>
    .gradient
        background: linear-gradient(0deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,0) 100%)
</style>