<template>
    <form class="contents" @submit.prevent="triggerStatus()">
        <SettingsTitle>Status Codes</SettingsTitle>
        <SettingsRow title="Trigger status" description="Trigger a status code">
            <IodInput class="flex-1" type="number" v-model="form.status" />
        </SettingsRow>
        <SettingsRow>
            <IodButton class="flex-1" label="Trigger" :loading="form.processing" />
        </SettingsRow>
    </form>
    <SettingsSpacer />

    

    <SettingsTitle>Iod Components</SettingsTitle>
    <SettingsRow title="IodPopup" description="Open a test popup">
        <IodButtonGroup class="flex-1">
            <IodButton variant="contained" @click="popup_1.open()">Left</IodButton>
            <IodButton variant="contained" @click="popup_2.open()">Center</IodButton>
            <IodButton variant="contained" @click="popup_3.open()">Right</IodButton>
        </IodButtonGroup>
    </SettingsRow>

    <SettingsRow title="IodIcon" description="Show an image or icon with or without background">
        <HeFlex horizontal gap=".5rem">
            <IodIcon icon="star" class="h-10 rounded-full text-zinc-700"/>
            <IodIcon icon="star_half" color="var(--bg-zinc-700)" class="h-10 rounded-full"/>
            <IodIcon image="https://api.dicebear.com/8.x/croodles/svg?seed=3" class="h-10 rounded-full"/>
            <IodIcon icon="star" use-backdrop class="h-10 rounded-full text-zinc-700"/>
            <IodIcon icon="star_half" color="var(--bg-zinc-700)" use-backdrop class="h-10 rounded-full"/>
            <IodIcon image="https://api.dicebear.com/8.x/croodles/svg?seed=3" use-backdrop class="h-10 rounded-full"/>
        </HeFlex>
    </SettingsRow>

    <SettingsRow title="IodProfileArray" description="Show an array of IodIcons">
        <IodProfileArray :data="profiles" :limit="6" class="ml-auto"/>
    </SettingsRow>



    <IodPopup ref="popup_1" title="Left Popup" placement="left">
        <HeFlex gap="1rem" padding="1rem">
            Lorem ipsum dolor sit amet consectetur adipisicing elit consequuntur
        </HeFlex>
    </IodPopup>

    <IodPopup ref="popup_2" title="Center Popup" placement="center">
        <HeFlex gap="1rem" padding="1rem">
            Lorem ipsum dolor sit amet consectetur adipisicing elit consequuntur
        </HeFlex>
    </IodPopup>

    <IodPopup ref="popup_3" title="Right Popup" placement="right">
        <HeFlex gap="1rem" padding="1rem">
            Lorem ipsum dolor sit amet consectetur adipisicing elit consequuntur
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'



    const form = useForm({
        status: 403,
    })

    function triggerStatus() {
        form.get('/api/debug/status/'+form.status, {
            onSuccess(data: Object) {
                toast.success('Status triggered')
            },
            onError(error: any) {
                toast.error(error.statusCode+' - '+error.data.message)
            },
        })
    }



    const popup_1 = ref()
    const popup_2 = ref()
    const popup_3 = ref()

    const profiles = ref([
        { label: 'Peter', icon: 'home', color: 'var(--bg-zinc-500)' },
        { label: 'Peter', icon: 'home', color: 'var(--bg-zinc-700)' },
        { label: 'Peter', icon: 'home', color: 'var(--bg-zinc-900)' },
        { label: 'Salem', image: 'https://api.dicebear.com/8.x/croodles/svg?seed=1' },
        { label: 'Mike', image: 'https://api.dicebear.com/8.x/croodles/svg?seed=2' },
        { label: 'Hugo', image: 'https://api.dicebear.com/8.x/croodles/svg?seed=3' },
    ])
</script>

<style lang="sass" scoped></style>
