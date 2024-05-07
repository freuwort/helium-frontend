<template>
    <IodPopup ref="popup" title="Medien freigeben">
        <Flex is="form" padding="1.5rem" gap="1.5rem" @submit.prevent="share">
            <ErrorAlert :errors="form.errors" />

            <Flex gap=".5rem">
                <ContextMenuLabel label="Verfügbarkeit"/>
                <IodButtonGroup>
                    <IodButton type="button" label="Vererbt" :variant="form.access === null ? 'filled' : 'contained'" @click="form.access = null"/>
                    <IodButton type="button" label="Öffentlich" :variant="form.access === 'public' ? 'filled' : 'contained'" @click="form.access = 'public'"/>
                    <IodButton type="button" label="Privat" :variant="form.access === 'private' ? 'filled' : 'contained'" @click="form.access = 'private'"/>
                </IodButtonGroup>
            </Flex>
            
            <Flex gap=".5rem">
                <ContextMenuLabel label="Nutzer"/>
                <VDropdown :shown="!!users.search.length && !!users.results.length" :triggers="[]" :auto-hide="false">
                    <IodInput type="search" placeholder="Nutzer suchen" v-model="users.search" @update:modelValue="searchUsers()">
                        <template #right>
                            <select v-model="userRole">
                                <option value="read">Ansehen</option>
                                <option value="write">Bearbeiten</option>
                            </select>
                        </template>
                    </IodInput>

                    <template #popper>
                        <Flex y-align="flex-start" padding="1rem 0" class="min-w-20 max-h-20 small-scrollbar">
                            <ProfileChip class="h-3 padding-0-5" v-for="user in users.results" :title="user.name" :image="user.profile_image" @click="addUser(user)"/>
                        </Flex>
                    </template>
                </VDropdown>
                <Flex>
                    <ProfileChip is="div" style="padding: .5rem; height: 3rem" v-for="user in form.users" :title="user.name" :image="user.profile_image">
                        <IodButtonGroup>
                            <IodIconButton type="button" size="s" icon="visibility" v-tooltip="'kann ansehen'" :variant="user.role === 'read' ? 'filled' : 'contained'" @click="user.role = 'read'"/>
                            <IodIconButton type="button" size="s" icon="edit" v-tooltip="'kann bearbeiten'" :variant="user.role === 'write' ? 'filled' : 'contained'" @click="user.role = 'write'"/>
                            <IodIconButton type="button" size="s" icon="verified_user" v-tooltip="'Besitzt'" :variant="user.role === 'owner' ? 'filled' : 'contained'" @click="user.role = 'owner'"/>
                        </IodButtonGroup>
                        <IodIconButton type="button" size="s" variant="text" icon="close" v-tooltip="'Entfernen'" @click.stop="removeUser(user)"/>
                    </ProfileChip>
                </Flex>
                <IodAlert as="placeholder" class="h-4" v-if="!form.users.length">Keine Nutzer vorhanden</IodAlert>
            </Flex>
            
            <Flex gap=".5rem">
                <ContextMenuLabel label="Rollen"/>
                <VDropdown :shown="!!roles.search.length && !!roles.results.length" :triggers="[]" :auto-hide="false">
                    <IodInput type="search" placeholder="Rollen suchen" v-model="roles.search" @update:modelValue="searchRoles()" />

                    <template #popper>
                        <Flex y-align="flex-start" padding="1rem 0" class="min-w-20 max-h-20 small-scrollbar">
                            <ProfileChip class="h-3 padding-0-5" v-for="role in roles.results" :title="role.name" :icon="role.icon" :color="role.color" @click="addRole(role)"/>
                        </Flex>
                    </template>
                </VDropdown>
                <Flex>
                    <ProfileChip is="div" style="padding: .5rem; height: 3rem" v-for="role in form.roles" :title="role.name" :icon="role.icon" :color="role.color">
                        <IodIconButton type="button" size="s" variant="text" icon="close" v-tooltip="'Entfernen'" @click.stop="removeRole(role)"/>
                    </ProfileChip>
                </Flex>
                <IodAlert as="placeholder" class="h-4" v-if="!form.roles.length">Keine Rollen vorhanden</IodAlert>
            </Flex>
            
            <IodButton type="submit" size="l" variant="filled" label="Freigabe übernehmen" :loading="form.processing" />
        </Flex>
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