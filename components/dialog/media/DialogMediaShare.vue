<template>
    <IodPopup ref="popup" title="Medien freigeben">
        <HeFlex is="form" padding="1.5rem" gap="2.5rem" @submit.prevent="share">
            <ErrorAlert :errors="form.errors" />

            <HeFlex padding=".5rem" gap=".5rem" class="border rounded-xl">
                <IodButtonGroup>
                    <IodButton type="button" background="var(--color-text-soft)" label="Wie Überordner" :variant="form.access === null ? 'filled' : 'contained'" @click="form.access = null"/>
                    <IodButton type="button" background="var(--color-text-soft)" label="Angebasst" :variant="form.access === 'custom' ? 'filled' : 'contained'" @click="form.access = 'custom'"/>
                </IodButtonGroup>
                <IodAlert as="placeholder" class="min-h-12">
                    <small v-show="form.access === null">Alle Freigaben des überliegenden Ordners werden übernommen</small>
                    <small v-show="form.access === 'custom'">Fragaben können individuell angepasst werden</small>
                </IodAlert>
            </HeFlex>
            
            <HeFlex padding=".5rem" gap=".5rem" class="border rounded-xl" v-show="form.access === 'custom'">
                <VDropdown :shown="!!searchForm.search.length && !!searchForm.results.length" :triggers="[]" :auto-hide="false">
                    <IodInput type="search" placeholder="Nutzer / Rolle suchen" v-model="searchForm.search" @update:modelValue="search()">
                        <template #right>
                            <IodButtonGroup>
                                <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="visibility" v-tooltip="localizePermission('read')" :variant="searchForm.permission === 'read' ? 'filled' : 'contained'" @click="searchForm.permission = 'read'"/>
                                <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="edit" v-tooltip="localizePermission('write')" :variant="searchForm.permission === 'write' ? 'filled' : 'contained'" @click="searchForm.permission = 'write'"/>
                            </IodButtonGroup>
                        </template>
                    </IodInput>

                    <template #popper>
                        <HeFlex align-y="flex-start" padding="1rem 0" class="min-w-80 max-h-80 small-scrollbar">
                            <ProfileChip class="h-12 !p-2 flex-none" corner="none" v-for="result in searchForm.results" :title="result.title" :subtitle="localizeModelType(result.model_type)" :image="result.image" :icon="result.icon" :color="result.color" @click="addShare(result)"/>
                        </HeFlex>
                    </template>
                </VDropdown>

                <ProfileChip is="div" class="h-12 !p-2 flex-none" v-for="share in form.shares" :title="share.title" :subtitle="localizeModelType(share.model_type) +' » ' + localizePermission(share.permission)" :image="share.image" :icon="share.icon" :color="share.color">
                    <HeFlex horizontal gap=".5rem">
                        <IodButtonGroup>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="visibility" v-tooltip="localizePermission('read')" :variant="share.permission === 'read' ? 'filled' : 'contained'" @click="share.permission = 'read'"/>
                            <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="edit" v-tooltip="localizePermission('write')" :variant="share.permission === 'write' ? 'filled' : 'contained'" @click="share.permission = 'write'"/>
                        </IodButtonGroup>
                        <IodIconButton type="button" size="s" icon="close" v-tooltip="'Entfernen'" variant="contained" color-preset="error" @click.stop="removeShare(share)"/>
                    </HeFlex>
                </ProfileChip>

                <IodAlert as="placeholder" class="h-12" v-if="!form.shares.length">
                    <small>Keine Freigaben vorhanden</small>
                </IodAlert>
            </HeFlex>
            
            <IodButton type="submit" size="l" variant="filled" label="Freigabe übernehmen" :loading="form.processing" />
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'
    


    const popup = ref()
    const form = useForm({
        shares: [],
        access: null,
        path: '',
    })

    function open(item: MediaItem)
    {
        form
        .defaults({
            shares: item.shares.map(share => ({
                id: share.id,
                model_id: share.model_id,
                model_type: share.model_type,
                image: share.model?.profile_image || null,
                icon: share.model?.icon || null,
                color: share.model?.color || null,
                title: share.model?.name || null,
                subtitle: share.permission || 'read',
            })),
            access: item.access || null,
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

    function addShare(share: any) {
        form.shares.push({
            ...share,
            id: null,
            permission: searchForm.permission
        })

        searchForm.reset()
    }

    function removeShare(share: any) {
        form.shares = form.shares.filter((e: any) => e.model_id !== share.model_id || e.model_type !== share.model_type)
    }



    function localizePermission(role: string) {
        switch (role) {
            case null : return 'Vererbt'
            case 'read': return 'Kann ansehen'
            case 'write': return 'Kann bearbeiten'
            case 'owner': return 'Eigentümer'
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