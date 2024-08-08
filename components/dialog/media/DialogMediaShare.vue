<template>
    <IodPopup ref="popup" title="Medien freigeben">
        <HeFlex is="form" padding="1.5rem" gap=".5rem" @submit.prevent="share">
            <ErrorAlert :errors="form.errors" />
            
            <IodButtonGroup>
                <IodButton type="button" size="l" background="var(--color-text-soft)" :variant="form.inherit_access ? 'filled' : 'contained'" label="Wie Überordner" v-tooltip="'Alle Freigaben des überliegenden Ordners werden übernommen'" @click="form.inherit_access = true"/>
                <IodButton type="button" size="l" background="var(--color-text-soft)" :variant="!form.inherit_access ? 'filled' : 'contained'" label="Angebasst" v-tooltip="'Freigaben können individuell angepasst werden'" @click="form.inherit_access = false"/>
            </IodButtonGroup>

            <HeDivider class="my-4"/>

            <template v-if="!form.inherit_access">
                <VDropdown :shown="!!searchForm.search.length && !!searchForm.results.length" :triggers="[]" :auto-hide="false">
                    <IodInput class="mb-2" type="search" placeholder="Nutzer / Rolle suchen" v-model="searchForm.search" @update:modelValue="search()" />

                    <template #popper>
                        <HeFlex align-y="flex-start" padding="1rem 0" class="min-w-80 max-h-80 small-scrollbar">
                            <ProfileChip class="h-12 !p-2 flex-none" corner="none" v-for="result in searchForm.results" :title="result.title" :subtitle="localizeModelType(result.permissible_type)" :image="result.image" :icon="result.icon" :color="result.color" @click="addShare(result)"/>
                        </HeFlex>
                    </template>
                </VDropdown>

                <ProfileChip is="div" class="h-12 !p-2 flex-none" title="Jeder mit dem Link" :subtitle="localizePermission(form.public_access)" icon="public">
                    <HeFlex horizontal gap=".5rem">
                        <IodIconButton type="button" size="s" icon="block" v-tooltip="localizePermission(null)" :variant="form.public_access === null ? 'filled' : 'contained'" color-preset="error" @click="form.public_access = null"/>
                        <IodButtonGroup>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="visibility" v-tooltip="localizePermission('read')" :variant="form.public_access === 'read' ? 'filled' : 'contained'" @click="form.public_access = 'read'"/>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="edit" v-tooltip="localizePermission('write')" :variant="form.public_access === 'write' ? 'filled' : 'contained'" @click="form.public_access = 'write'"/>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="shield_person" v-tooltip="localizePermission('admin')" :variant="form.public_access === 'admin' ? 'filled' : 'contained'" @click="form.public_access = 'admin'"/>
                        </IodButtonGroup>
                    </HeFlex>
                </ProfileChip>

                <ProfileChip is="div" class="h-12 !p-2 flex-none" v-for="access in form.access" :title="localizeModelType(access.permissible_type) +' » ' + access.title" :subtitle="localizePermission(access.permission)" :image="access.image" :icon="access.icon" :color="access.color">
                    <HeFlex horizontal gap=".5rem">
                        <IodIconButton type="button" size="s" icon="close" v-tooltip="'Entfernen'" variant="contained" color-preset="error" @click.stop="removeShare(access)"/>
                        <IodButtonGroup>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="visibility" v-tooltip="localizePermission('read')" :variant="access.permission === 'read' ? 'filled' : 'contained'" @click="access.permission = 'read'"/>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="edit" v-tooltip="localizePermission('write')" :variant="access.permission === 'write' ? 'filled' : 'contained'" @click="access.permission = 'write'"/>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="shield_person" v-tooltip="localizePermission('admin')" :variant="access.permission === 'admin' ? 'filled' : 'contained'" @click="access.permission = 'admin'"/>
                        </IodButtonGroup>
                    </HeFlex>
                </ProfileChip>

                <HeDivider class="my-4"/>
            </template>
            
            <IodButton type="submit" size="l" variant="filled" label="Freigabe übernehmen" :loading="form.processing" />
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'
    


    const popup = ref()
    const form = useForm({
        access: [],
        public_access: null,
        inherit_access: true,
        path: '',
    })

    function open(item: MediaItem)
    {
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

        searchForm.reset()

        popup.value.open()
    }

    function share() {
        form.patch('/api/media/share', {
            onSuccess() { emits('saved') }
        })
    }



    const searchForm = useForm({
        search: '',
        results: [],
    })

    async function search() {
        let results = []

        let userResponse = await useAxios().get(apiRoute('/api/users/basic', {
            filter: { search: searchForm.search },
            size: 10,
        }))
        
        results.push(...userResponse.data.data.map((user: any) => ({
            permissible_id: user.id,
            permissible_type: 'user',
            title: user.name,
            image: user.avatar,
            icon: null,
            color: null,
        })))
        
        let roleResponse = await useAxios().get(apiRoute('/api/roles/basic', {
            filter: { search: searchForm.search },
            size: 10,
        }))

        results.push(...roleResponse.data.data.map((role: any) => ({
            permissible_id: role.id,
            permissible_type: 'role',
            title: role.name,
            image: null,
            icon: role.icon,
            color: role.color,
        })))

        searchForm.results = results
    }

    function addShare(access: any) {
        form.access.push({
            ...access,
            permission: 'read'
        })

        searchForm.reset()
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