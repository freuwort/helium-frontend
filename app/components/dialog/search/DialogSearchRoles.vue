<template>
    <ContextMenu class="!pt-0">
        <IodLoader type="bar" class="absolute top-0 left-0 right-0" v-show="form.processing"/>

        <IodInput type="search" class="!h-16 !bg-transparent !rounded-none border-b mb-4" label="Nach Rollen suchen" v-model="form.search" />
        
        <div class="flex flex-col overflow-y-auto max-h-80 small-scrollbar">
            <ContextMenuItem is="button" v-for="role in form.results" :key="role.id" :icon="role.icon" :color="role.color" :label="role.name" @click="emit('select', [role])" />
            <IodAlert type="placeholder" v-if="!form.results.length && form.search.trim()">
                <div class="flex flex-col py-4 items-center">
                    <span>Keine Rollen für "{{ form.search.trim() }}"</span>
                    <IodButton class="!normal-case" size="xs" variant="text" color-preset="info" :label='`"${form.search.trim()}" Rolle erstellen`' :loading="form.processing" @click="create(form.search.trim())" />
                </div>
            </IodAlert>
            <IodAlert type="placeholder" class="h-24 flex-none" v-if="!form.results.length && !form.search.trim()">
                <IodLoader class="my-2 mx-auto"/>
                Lade Rollen
            </IodAlert>
        </div>

        <ContextMenuDivider/>

        <div class="flex items-center gap-1 px-4 select-none">
            <b class="flex flex-1">Aktionen</b>
            <IodIconButton type="button" class="!w-12" size="s" corner="pill" variant="text" icon="refresh" v-tooltip="'Aktualisieren'" @click="throttledSearch"/>
            <IodIconButton target="_blank" class="!w-12" size="s" corner="pill" variant="text" icon="open_in_new" v-tooltip="'Alle Rollen anzeigen'" :is="NuxtLink" to="/roles"/>
        </div>
    </ContextMenu>
</template>

<script lang="ts" setup>
    import _ from 'lodash'
    import { toast } from 'vue3-toastify'

    const NuxtLink = defineNuxtLink({})

    const props = defineProps({
        route: {
            type: String,
            default: '/api/roles/basic',
        },
        filter: {
            type: Object,
            default: () => {},
        },
        size: {
            type: Number,
            default: 20,
        }
    })

    const form = useForm({
        search: '',
        results: [],
    })

    const throttledSearch = _.throttle(search, 400)

    function search() {
        form.get(apiRoute(props.route, {
            filter: {
                ...props.filter,
                search: form.search.trim(),
            },
            size: props.size,
        }), {
            onSuccess(response: any) {
                form.results = response.data
            },
            onError(error: any) {
                toast.error(error.data)
            },
        })
    }

    function create(name: string) {
        form
        .transform(() => ({ name, permissions: [] }))
        .post(apiRoute('/api/roles'), {
            onSuccess() {
                search()
                toast.success(`"${name}" Rolle erstellt`)
            },
            onError(error: any) {
                toast.error(error)
            },
        })
    }

    watch(() => form.search, throttledSearch, { immediate: true, deep: true })
    watch(() => props.filter, throttledSearch, { deep: true })

    const emit = defineEmits(['select'])
</script>

<style lang="sass" scoped>
</style>