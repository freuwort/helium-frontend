<template>
    <IodPopup ref="popup" title="Medien freigeben">
        <HeFlex is="form" padding="1.5rem" gap=".5rem" @submit.prevent="share">
            <ErrorAlert :errors="form.errors" />
            
            <div class="flex rounded-full p-1 gap-2 bg-background-soft">
                <IodButton type="button" class="flex-1" corner="pill" :variant="form.inherit_access ? 'contained' : 'text'" label="Wie Überordner" v-tooltip="'Alle Freigaben des überliegenden Ordners werden übernommen'" @click="form.inherit_access = true"/>
                <IodButton type="button" class="flex-1" corner="pill" :variant="!form.inherit_access ? 'contained' : 'text'" label="Angepasst" v-tooltip="'Freigaben können individuell angepasst werden'" @click="form.inherit_access = false"/>
            </div>

            <HeDivider class="my-4"/>

            <template v-if="!form.inherit_access">
                <div class="flex items-center gap-4 pb-2" id="dialog-media-share">
                    <VDropdown placement="left-start" container="#dialog-media-share">
                        <IodButton type="button" size="s" corner="pill" variant="contained" icon-left="add" label="Rollen hinzufügen" normal-case/>

                        <template #popper>
                            <DialogSearchRoles @select="addShare({ permissible_id: $event[0].id, permissible_type: 'role', title: $event[0].name, image: null, icon: $event[0].icon, color: $event[0].color })" />
                        </template>
                    </VDropdown>

                    <VDropdown placement="left-start" container="#dialog-media-share">
                        <IodButton type="button" size="s" corner="pill" variant="contained" icon-left="add" label="Nutzer hinzufügen" normal-case/>

                        <template #popper>
                            <DialogSearchUsers @select="addShare({ permissible_id: $event[0].id, permissible_type: 'user', title: $event[0].name, image: $event[0].avatar, icon: null, color: null })" />
                        </template>
                    </VDropdown>
                </div>

                <ProfileChip is="div" class="h-12 !rounded-full !p-2 bg-background-soft flex-none" title="Jeder mit dem Link" :subtitle="localizePermission(form.public_access)" icon="public">
                    <div class="flex items-center gap-1">
                        <IodIconButton type="button" size="s" corner="pill" icon="visibility" v-tooltip="localizePermission('read')" :variant="form.public_access === 'read' ? 'filled' : 'text'" @click="form.public_access = 'read'"/>
                        <IodIconButton type="button" size="s" corner="pill" icon="edit" v-tooltip="localizePermission('write')" :variant="form.public_access === 'write' ? 'filled' : 'text'" @click="form.public_access = 'write'"/>
                        <IodIconButton type="button" size="s" corner="pill" icon="shield_person" v-tooltip="localizePermission('admin')" :variant="form.public_access === 'admin' ? 'filled' : 'text'" @click="form.public_access = 'admin'"/>
                        <HeDivider vertical class="h-6 mx-1 focused"/>
                        <IodIconButton type="button" size="s" corner="pill" icon="block" v-tooltip="localizePermission(null)" :variant="form.public_access === null ? 'filled' : 'contained'" color-preset="error" @click="form.public_access = null"/>
                    </div>
                </ProfileChip>

                <ProfileChip is="div" class="h-12 !rounded-full !p-2 bg-background-soft flex-none" v-for="access in form.access" :title="localizeModelType(access.permissible_type) +' » ' + access.title" :subtitle="localizePermission(access.permission)" :image="access.image" :icon="access.icon" :color="access.color">
                    <div class="flex items-center gap-1">
                        <IodIconButton type="button" size="s" corner="pill" icon="visibility" v-tooltip="localizePermission('read')" :variant="access.permission === 'read' ? 'filled' : 'text'" @click="access.permission = 'read'"/>
                        <IodIconButton type="button" size="s" corner="pill" icon="edit" v-tooltip="localizePermission('write')" :variant="access.permission === 'write' ? 'filled' : 'text'" @click="access.permission = 'write'"/>
                        <IodIconButton type="button" size="s" corner="pill" icon="shield_person" v-tooltip="localizePermission('admin')" :variant="access.permission === 'admin' ? 'filled' : 'text'" @click="access.permission = 'admin'"/>
                        <HeDivider vertical class="h-6 mx-1 focused"/>
                        <IodIconButton type="button" size="s" corner="pill" icon="close" v-tooltip="'Entfernen'" variant="contained" color-preset="error" @click.stop="removeShare(access)"/>
                    </div>
                </ProfileChip>

                <HeDivider class="my-4"/>
            </template>
            
            <IodButton class="ml-auto" type="submit" size="l" corner="pill" icon-right="send" label="Freigeben" :loading="form.processing"/>
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~~/types/media'
    


    const popup = ref()
    const form = useForm({
        access: [],
        public_access: null,
        inherit_access: true,
        path: '',
    })

    function open(item: MediaItem) {
        form
        .defaults({
            access: item.access
            .filter(access => !!access.permissible_id)
            .sort((a, b) => a.permissible_type.localeCompare(b.permissible_type) || a.permissible?.name?.localeCompare(b.permissible?.name))
            .map(access => ({
                permissible_id: access.permissible_id,
                permissible_type: access.permissible_type,
                permission: access.permission || 'read',
                image: access.permissible?.avatar || null,
                icon: access.permissible?.icon || null,
                color: access.permissible?.color || null,
                title: access.permissible?.name || null,
            })),
            public_access: item.access.find(access => !access.permissible_id)?.permission ?? null,
            inherit_access: item.inherit_access || false,
            path: item.src_path,
        })
        .reset()

        popup.value.open()
    }

    function share() {
        form.patch('/api/media/share', {
            onSuccess() {
                emits('saved')
                popup.value.close()
            }
        })
    }

    function addShare(access: any) {
        form.access.push({ ...access, permission: 'read' })
    }

    function removeShare(access: any) {
        form.access = form.access.filter((e: any) => e.permissible_id !== access.permissible_id || e.permissible_type !== access.permissible_type)
    }



    function localizePermission(role: any) {
        switch (role) {
            case null: return 'Keinen Zugriff'
            case 'read': return 'Kann ansehen'
            case 'write': return 'Kann bearbeiten'
            case 'admin': return 'Kann bearbeiten und löschen'
            default: return role
        }
    }

    function localizeModelType(type: any) {
        switch (type) {
            case 'user': return 'Nutzer'
            case 'role': return 'Rolle'
            default: return type
        }
    }



    const emits = defineEmits(['saved'])
    defineExpose({ open })
</script>

<style lang="sass" scoped>
</style>