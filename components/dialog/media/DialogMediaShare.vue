<template>
    <IodPopup ref="popup" title="Medien freigeben">
        <HeFlex is="form" padding="1.5rem" gap="2.5rem" @submit.prevent="share">
            <ErrorAlert :errors="form.errors" />

            <HeFlex padding=".5rem" gap=".5rem" class="border rounded-xl">
                <IodButtonGroup>
                    <IodButton type="button" background="var(--color-text-soft)" label="Wie Überordner" :variant="form.inherit_access ? 'filled' : 'contained'" @click="form.inherit_access = true"/>
                    <IodButton type="button" background="var(--color-text-soft)" label="Angebasst" :variant="!form.inherit_access ? 'filled' : 'contained'" @click="form.inherit_access = false"/>
                </IodButtonGroup>
                <IodAlert as="placeholder" class="min-h-12">
                    <small v-show="form.inherit_access">Alle Freigaben des überliegenden Ordners werden übernommen</small>
                    <small v-show="!form.inherit_access">Fragaben können individuell angepasst werden</small>
                </IodAlert>
            </HeFlex>
            
            <HeFlex padding=".5rem" gap=".5rem" class="border rounded-xl" v-show="!form.inherit_access">
                <VDropdown :shown="!!searchForm.search.length && !!searchForm.results.length" :triggers="[]" :auto-hide="false">
                    <IodInput type="search" placeholder="Nutzer / Rolle suchen" v-model="searchForm.search" @update:modelValue="search()">
                        <template #right>
                            <IodButtonGroup>
                                <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="visibility" v-tooltip="localizePermission('read')" :variant="searchForm.permission === 'read' ? 'filled' : 'contained'" @click="searchForm.permission = 'read'"/>
                                <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="edit" v-tooltip="localizePermission('write')" :variant="searchForm.permission === 'write' ? 'filled' : 'contained'" @click="searchForm.permission = 'write'"/>
                                <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="shield_person" v-tooltip="localizePermission('admin')" :variant="searchForm.permission === 'admin' ? 'filled' : 'contained'" @click="searchForm.permission = 'admin'"/>
                            </IodButtonGroup>
                        </template>
                    </IodInput>

                    <template #popper>
                        <HeFlex align-y="flex-start" padding="1rem 0" class="min-w-80 max-h-80 small-scrollbar">
                            <ProfileChip class="h-12 !p-2 flex-none" corner="none" v-for="result in searchForm.results" :title="result.title" :subtitle="localizeModelType(result.model_type)" :image="result.image" :icon="result.icon" :color="result.color" @click="addShare(result)"/>
                        </HeFlex>
                    </template>
                </VDropdown>

                <ProfileChip is="div" class="h-12 !p-2 flex-none" v-for="access in form.access" :title="access.title" :subtitle="localizeModelType(access.model_type) +' » ' + localizePermission(access.permission)" :image="access.image" :icon="access.icon" :color="access.color">
                    <HeFlex horizontal gap=".5rem">
                        <IodButtonGroup>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="visibility" v-tooltip="localizePermission('read')" :variant="access.permission === 'read' ? 'filled' : 'contained'" @click="access.permission = 'read'"/>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="edit" v-tooltip="localizePermission('write')" :variant="access.permission === 'write' ? 'filled' : 'contained'" @click="access.permission = 'write'"/>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="shield_person" v-tooltip="localizePermission('admin')" :variant="access.permission === 'admin' ? 'filled' : 'contained'" @click="access.permission = 'admin'"/>
                        </IodButtonGroup>
                        <IodIconButton type="button" size="s" icon="close" v-tooltip="'Entfernen'" variant="contained" color-preset="error" @click.stop="removeShare(access)"/>
                    </HeFlex>
                </ProfileChip>

                <IodAlert as="placeholder" class="h-12" v-if="!form.access?.length">
                    <small>Keine Freigaben vorhanden</small>
                </IodAlert>
            </HeFlex>

            <!-- <IodAlert>
                <pre class="w-full overflow-auto small-scrollbar" v-text="JSON.stringify(form, null, 2)"></pre>
            </IodAlert> -->
            
            <IodButton type="submit" size="l" variant="filled" label="Freigabe übernehmen" :loading="form.processing" />
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'
    


    const popup = ref()
    const form = useForm({
        access: [],
        inherit_access: true,
        path: '',
    })

    function open(item: MediaItem)
    {
        form
        .defaults({
            access: item.access.map(access => ({
                model_id: access.model_id,
                model_type: access.model_type,
                permission: access.permission || 'read',
                image: access.model?.profile_image || null,
                icon: access.model?.icon || null,
                color: access.model?.color || null,
                title: access.model?.name || null,
            })),
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
        permission: 'read',
        results: [],
    })

    async function search() {
        let results = []

        let userResponse = await useAxios().get(apiRoute('/api/users/basic', {
            filter: { search: searchForm.search },
            size: 10,
        }))
        
        results.push(...userResponse.data.data.map((user: any) => ({
            model_id: user.id,
            model_type: 'user',
            title: user.name,
            image: user.profile_image,
            icon: null,
            color: null,
        })))
        
        let roleResponse = await useAxios().get(apiRoute('/api/roles/basic', {
            filter: { search: searchForm.search },
            size: 10,
        }))

        results.push(...roleResponse.data.data.map((role: any) => ({
            model_id: role.id,
            model_type: 'role',
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
            permission: searchForm.permission
        })

        searchForm.reset()
    }

    function removeShare(access: any) {
        form.access = form.access.filter((e: any) => e.model_id !== access.model_id || e.model_type !== access.model_type)
    }



    function localizePermission(role: string) {
        switch (role) {
            case 'read': return 'Kann ansehen'
            case 'write': return 'Kann bearbeiten'
            case 'admin': return 'Kann bearbeiten und löschen'
            default: return role
        }
    }

    function localizeModelType(type: string) {
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