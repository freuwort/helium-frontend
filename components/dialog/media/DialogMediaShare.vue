<template>
    <IodPopup ref="popup" title="Medien freigeben">
        <HeFlex is="form" padding="1.5rem" gap="2.5rem" @submit.prevent="share">
            <ErrorAlert :errors="form.errors" />

            <HeFlex padding=".5rem" gap=".5rem" class="border rounded-xl">
                <IodButtonGroup>
                    <IodButton type="button" background="var(--color-text-soft)" label="Vererbt" :variant="form.access === null ? 'filled' : 'contained'" @click="form.access = null"/>
                    <IodButton type="button" background="var(--color-text-soft)" label="Öffentlich" :variant="form.access === 'public' ? 'filled' : 'contained'" @click="form.access = 'public'"/>
                    <IodButton type="button" background="var(--color-text-soft)" label="Privat" :variant="form.access === 'private' ? 'filled' : 'contained'" @click="form.access = 'private'"/>
                </IodButtonGroup>
                <IodAlert as="placeholder" class="min-h-12">
                    <small v-show="form.access === null">Alle Freigaben des überliegenden Ordners werden übernommen</small>
                    <small v-show="form.access === 'public'"><b>Alle Nutzer</b> mit dem Link können die Medien ansehen</small>
                    <small v-show="form.access === 'private'">Nur <b>ausgewählte Nutzer</b> oder <b>Gruppen</b> können die Medien ansehen</small>
                </IodAlert>
            </HeFlex>
            
            <HeFlex padding=".5rem" gap=".5rem" class="border rounded-xl">
                <VDropdown :shown="!!users.search.length && !!users.results.length" :triggers="[]" :auto-hide="false">
                    <IodInput type="search" placeholder="Nutzer hinzufügen" v-model="users.search" @update:modelValue="searchUsers()">
                        <template #right>
                            <select v-model="userRole">
                                <option value="read">{{ localizePermission('read') }}</option>
                                <option value="write">{{ localizePermission('write') }}</option>
                            </select>
                        </template>
                    </IodInput>

                    <template #popper>
                        <HeFlex align-y="flex-start" padding="1rem 0" class="min-w-80 max-h-80 small-scrollbar">
                            <ProfileChip class="h-12 p-2" corner="none" v-for="user in users.results" :title="user.name" :image="user.profile_image" @click="addUser(user)"/>
                        </HeFlex>
                    </template>
                </VDropdown>

                <ProfileChip is="div" style="padding: .5rem; height: 3rem" v-for="user in form.users" :title="user.name" :subtitle="localizePermission(user.role)" :image="user.profile_image">
                    <HeFlex horizontal gap=".5rem">
                        <template v-if="user.role !== 'owner'">
                            <IodButtonGroup>
                                <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="visibility" v-tooltip="localizePermission('read')" :variant="user.role === 'read' ? 'filled' : 'contained'" @click="user.role = 'read'"/>
                                <IodIconButton type="button" size="s" background="var(--color-text-soft)" icon="edit" v-tooltip="localizePermission('write')" :variant="user.role === 'write' ? 'filled' : 'contained'" @click="user.role = 'write'"/>
                            </IodButtonGroup>
                            <IodIconButton type="button" size="s" icon="close" v-tooltip="'Entfernen'" variant="contained" color-preset="error" @click.stop="removeUser(user)"/>
                        </template>
                    </HeFlex>
                </ProfileChip>

                <IodAlert as="placeholder" class="h-12" v-if="!form.users.length">Keine Nutzer vorhanden</IodAlert>
            </HeFlex>
            
            <HeFlex padding=".5rem" gap=".5rem" class="border rounded-xl">
                <VDropdown :shown="!!roles.search.length && !!roles.results.length" :triggers="[]" :auto-hide="false">
                    <IodInput type="search" placeholder="Rollen hinzufügen" v-model="roles.search" @update:modelValue="searchRoles()" />

                    <template #popper>
                        <HeFlex y-align="flex-start" padding="1rem 0" class="min-w-80 max-h-80 small-scrollbar">
                            <ProfileChip class="h-12 p-2" corner="none" v-for="role in roles.results" :title="role.name" :icon="role.icon" :color="role.color" @click="addRole(role)"/>
                        </HeFlex>
                    </template>
                </VDropdown>

                <ProfileChip is="div" style="padding: .5rem; height: 3rem" v-for="role in form.roles" :title="role.name" :subtitle="localizePermission('read')" :icon="role.icon" :color="role.color">
                    <IodIconButton type="button" size="s" icon="close" v-tooltip="'Entfernen'" variant="contained" color-preset="error" @click.stop="removeRole(role)"/>
                </ProfileChip>

                <IodAlert as="placeholder" class="h-12" v-if="!form.roles.length">Keine Rollen vorhanden</IodAlert>
            </HeFlex>
            
            <IodButton type="submit" size="l" variant="filled" label="Freigabe übernehmen" :loading="form.processing" />
        </HeFlex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'
    


    const popup = ref()
    const form = useForm({
        users: [],
        roles: [],
        access: null,
        path: '',
    })

    function open(item: MediaItem)
    {
        form.users = item.users.map(user => ({
            id: user.id,
            profile_image: user.profile_image,
            name: user.name,
            username: user.username,
            role: user.pivot?.role ?? null
        }))
        form.roles = item.roles
        form.access = item.access
        form.path = item.src_path

        users.search = ''
        users.results = []
        userRole.value = 'read'

        roles.search = ''
        roles.results = []

        popup.value.open()
    }

    function share() {
        form
        .transform(data => {
            let users = data.users.reduce((acc: any, user: any) => ({ ...acc, [user.id]: { role: user.role } }), {})
            let roles = data.roles.map((role: any) => role.id)
            return {...data, users, roles}
        })
        .patch('/api/media/share', {
            onSuccess() { emits('saved') }
        })
    }



    const users = useForm({
        search: '',
        results: [],
    })
    const userRole = ref('read')

    function localizePermission(role: string) {
        switch (role) {
            case 'read': return 'Kann ansehen'
            case 'write': return 'Kann bearbeiten'
            case 'owner': return 'Eigentümer'
            default: return role
        }
    }

    function searchUsers() {
        users.get(apiRoute('/api/users/basic', {
            filter: {
                search: users.search
            }
        }), {
            onSuccess(response: any) {
                users.results = response.value.data
            }
        })
    }

    function addUser(user: any) {
        form.users.push({
            id: user.id,
            profile_image: user.profile_image,
            name: user.name,
            username: user.username,
            role: userRole.value
        })

        users.search = ''
    }

    function removeUser(user: any) {
        form.users = form.users.filter((u: any) => u.id !== user.id)
    }


    const roles = useForm({
        search: '',
        results: [],
    })

    function searchRoles() {
        roles.get(apiRoute('/api/roles/basic', {
            filter: {
                search: roles.search
            }
        }), {
            onSuccess(response: any) {
                roles.results = response.value.data
            }
        })
    }

    function addRole(role: any) {
        form.roles.push(role)
        roles.search = ''
    }

    function removeRole(role: any) {
        form.roles = form.roles.filter((r: any) => r.id !== role.id)
    }



    const emits = defineEmits(['saved'])
    defineExpose({ open })
</script>

<style lang="sass" scoped>
</style>