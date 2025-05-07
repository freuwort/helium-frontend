<template>
    <IodPopup ref="popup" :title placement="right">
        <form class="flex flex-col p-4 pt-0 gap-4" @submit.prevent="save">
            <ErrorAlert :errors="form.errors" />
            
            <div class="flex flex-col p-4 gap-4 bg-background rounded-lg">
                <label class="flex flex-col gap-1">
                    <span class="px-1">Name</span>
                    <IodInput class="input-s" v-model="form.name"/>
                </label>
                <IodIconColorPicker class="gap-3" has-color has-icon v-model:color="form.color" v-model:icon="form.icon"/>
            </div>
            
            <div class="flex flex-col p-4 gap-4 bg-background rounded-lg" v-for="app in permissions.all">
                <h6 class="m-0 font-medium">{{ app.title }}</h6>
                
                <div class="flex flex-col" v-for="group in app.permissions">
                    <IodToggle v-for="permission in group" :key="permission.name" :modelValue="form.permissions.includes(permission.name)" @update:modelValue="togglePermission(permission.name)">
                        <template #label>
                            <div class="flex flex-col gap-1 text-sm">
                                <span class="font-heading text-text font-medium">{{ permission.label }}</span>
                                <small>{{ permission.description }}</small>
                            </div>
                        </template>
                    </IodToggle>
                </div>
            </div>

            <ContextMenu class="bg-background rounded-lg">
                <ContextMenuItem is="button" type="button" icon="delete" label="Löschen" color="var(--color-error)" :disabled="isNew" @click="destroy" />
            </ContextMenu>

            <IodButton class="!sticky bottom-4 z-10" type="submit" label="Speichern" :loading="form.processing"/>
        </form>
    </IodPopup>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'
    
    const popup = ref()
    const form = useForm({})
    const permissions = useForm({all: []})
    const emits = defineEmits(['change'])
    const isNew = computed(() => !form.id)
    const title = computed(() => isNew.value ? 'Rolle erstellen' : 'Rolle bearbeiten')



    // API Functions
    function fetch(id: string) {
        form.get(apiRoute('/api/roles/:id', { id }), {
            onSuccess(response: any) {
                form.defaults(response.data).reset()
            },
        })
    }

    function fetchPermissions() {
        permissions.get(apiRoute('/api/permissions'), {
            onSuccess(response: any) {
                permissions.defaults({all: response.data}).reset()
            },
        })
    }

    function store() {
        form.post(apiRoute('/api/roles'), {
            onSuccess(response: any) {
                form.defaults(response.data).reset()
                toast.success('Rolle wurde erstellt')
                emits('change')
            },
        })
    }

    function update() {
        form.patch(apiRoute('/api/roles/:id', { id: form.id }), {
            onSuccess(response: any) {
                form.defaults(response.data).reset()
                toast.success('Rolle wurde aktualisiert')
                emits('change')
            },
        })
    }

    function destroy() {
        form.delete(apiRoute('/api/roles/:id', { id: form.id }), {
            onSuccess(response: any) {
                popup.value.close()
                toast.info('Rolle wurde gelöscht')
                emits('change')
            },
        })
    }



    // Misc Functions
    function save() {
        return form.id ? update() : store()
    }

    function reset() {
        form.defaults({
            id: null,
            name: '',
            color: '#363E40',
            icon: 'category',
            created_at: '',
            updated_at: '',
            permissions: [],
        }).reset()
    }

    function togglePermission(permission: string) {
        if (form.permissions.includes(permission)) {
            form.permissions = form.permissions.filter((p: string) => p != permission)
        }
        else {
            form.permissions.push(permission)
        }
    }
    
    function open(id?: string) {
        // Reset form to empty state
        reset()
        
        // Load data if id is provided
        if (id) {fetch(id)}
        
        // Fetch permissions
        fetchPermissions()
        
        // Open UI
        popup.value.open()
    }


    // Expose functions
    defineExpose({
        open,
    })
</script>

<style lang="sass" scoped>
</style>