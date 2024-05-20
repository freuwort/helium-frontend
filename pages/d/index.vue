<template>
    <NuxtLayout name="auth-default" pageTitle="Startseite" color="var(--color-primary)">
        <HeCard>
            <HeFlex gap="1rem" padding="1rem">
                <ContextMenu>
                    <ContextMenuItem to="/d" show-chevron icon="dashboard">Startseite</ContextMenuItem>
                    <ContextMenuItem to="/d/files" show-chevron icon="drive_folder_upload">Dateien</ContextMenuItem>
                    <ContextMenuItem to="/d/users" show-chevron icon="group">Nutzer</ContextMenuItem>
                    <ContextMenuItem to="/d/settings" show-chevron icon="settings">Einstellungen</ContextMenuItem>
                </ContextMenu>

                <HeFlex horizontal gap="1rem">
                    <IodButton class="flex-1" @click="popup_1.open()" variant="contained" size="l" icon-left="dock_to_right">Left Popup</IodButton>
                    <IodButton class="flex-1" @click="popup_2.open()" variant="contained" size="l" icon-left="picture_in_picture_center">Center Popup</IodButton>
                    <IodButton class="flex-1" @click="popup_3.open()" variant="contained" size="l" icon-left="dock_to_left">Right Popup</IodButton>
                </HeFlex>

                <IodProfileArray :data="profiles" :limit="6" class="mr-auto"/>

                <HeFlex horizontal gap="1rem">
                    <IodIcon icon="home" use-backdrop class="h-12 rounded-full text-blue-500"/>
                    <IodIcon icon="home" color="var(--bg-purple-500)" use-backdrop class="h-12 rounded-full"/>
                    <IodIcon icon="home" color="var(--bg-rose-500)" use-backdrop class="h-12 rounded-full"/>
                    <IodIcon image="https://api.dicebear.com/8.x/shapes/svg?seed=1" use-backdrop class="h-12 rounded-full"/>
                    <IodIcon image="https://api.dicebear.com/8.x/shapes/svg?seed=2" use-backdrop class="h-12 rounded-full"/>
                    <IodIcon image="https://api.dicebear.com/8.x/shapes/svg?seed=3" use-backdrop class="h-12 rounded-full"/>
                </HeFlex>
            </HeFlex>
        </HeCard>

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
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: ['auth', '2fa-verified'],
    })

    const popup_1 = ref()
    const popup_2 = ref()
    const popup_3 = ref()

    const profiles = ref([
        { label: 'Peter', icon: 'home', color: 'var(--bg-blue-500)' },
        { label: 'Peter', icon: 'home', color: 'var(--bg-purple-500)' },
        { label: 'Peter', icon: 'home', color: 'var(--bg-rose-500)' },
        { label: 'Salem', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=1' },
        { label: 'Mike', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=2' },
        { label: 'Hugo', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=3' },
    ])
</script>

<style lang="sass" scoped></style>
