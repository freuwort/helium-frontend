<template>
    <NuxtLayout name="auth-default" pageTitle="Startseite" color="var(--color-primary)">
        <Card>
            <Flex :gap="1" :padding="1">
                <ContextMenu>
                    <ContextMenuItem to="/d" show-chevron icon="dashboard">Startseite</ContextMenuItem>
                    <ContextMenuItem to="/d/files" show-chevron icon="drive_folder_upload">Dateien</ContextMenuItem>
                    <ContextMenuItem to="/d/users" show-chevron icon="group">Nutzer</ContextMenuItem>
                    <ContextMenuItem to="/d/settings" show-chevron icon="settings">Einstellungen</ContextMenuItem>
                </ContextMenu>

                <Flex horizontal gap="1rem">
                    <IodButton class="flex-1" @click="popup_1.open()" variant="contained" size="l" icon-left="dock_to_right">Left Popup</IodButton>
                    <IodButton class="flex-1" @click="popup_2.open()" variant="contained" size="l" icon-left="picture_in_picture_center">Center Popup</IodButton>
                    <IodButton class="flex-1" @click="popup_3.open()" variant="contained" size="l" icon-left="dock_to_left">Right Popup</IodButton>
                </Flex>

                <IodProfileArray :data="profiles" :limit="6"/>
            </Flex>
        </Card>

        <IodPopup ref="popup_1" title="Left Popup" placement="left">
            <Flex gap="1rem" padding="1rem">
                Lorem ipsum dolor sit amet consectetur adipisicing elit consequuntur
            </Flex>
        </IodPopup>

        <IodPopup ref="popup_2" title="Center Popup" placement="center">
            <Flex gap="1rem" padding="1rem">
                Lorem ipsum dolor sit amet consectetur adipisicing elit consequuntur
            </Flex>
        </IodPopup>

        <IodPopup ref="popup_3" title="Right Popup" placement="right">
            <Flex gap="1rem" padding="1rem">
                Lorem ipsum dolor sit amet consectetur adipisicing elit consequuntur
            </Flex>
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
        { label: 'Salem', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=Salem' },
        { label: 'Mike', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=Mike' },
        { label: 'Hugo', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=Hugo' },
        { label: 'Johannes', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=Johannes' },
        { label: 'Amber', image: 'https://api.dicebear.com/8.x/shapes/svg?seed=Amber' },
    ])
</script>

<style lang="sass" scoped></style>
