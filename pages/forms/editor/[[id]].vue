<template>
    <NuxtLayout name="auth-default" limiter="medium" :scope pageTitle="Formular Editor" color="#06B6D4">
        <HeCard is="form" @submit.prevent="save">
            <div class="flex items-center p-4 rounded-t-2xl border-b sticky top-16 z-10 bg-background">
                <IodButton :is="NuxtLink" corner="pill" label="Zur Übersicht" variant="contained" to="/forms"/>
                <HeSpacer />
                <IodButton type="submit" corner="pill" label="Speichern" :loading="form.processing" variant="filled" />
            </div>

            <HeFlex :padding="2" :gap="3">
                <ErrorAlert :errors="form.errors" />



                <HeFlex :gap="1">
                    <h5 class="m-0 font-medium">Allgemeines</h5>
                    <IodInput label="Name" v-model="form.model.name" @input="form.model.slug = slugify(form.model.name)"/>
                    <IodInput label="Slug" v-model="form.model.slug">
                        <template #right>
                            <IodIconButton type="button" icon="auto_awesome" v-tooltip="'Automatisch generieren'" size="s" variant="text" @click="form.model.slug = slugify(form.model.name)"/>
                        </template>
                    </IodInput>
                    <IodInput label="Description" v-model="form.model.description"/>
                </HeFlex>



                <HeFlex :gap="1">
                    <HeFlex horizontal>
                        <h5 class="m-0 font-medium">Formular Felder</h5>
                        <HeSpacer />
                        <IodButton type="button" label="Neues Feld" size="s" variant="contained" @click="addField()"/>
                    </HeFlex>
    
                    <div class="entity-grid" v-if="form.form_fields.length">
                        <HeCard class="entity-card" v-for="field, i in form.form_fields">
                            <HeFlex class="entity-card-head" padding="1rem">
                                <IodIcon icon="stylus" />
                                <IodButton type="button" label="Löschen" size="s" variant="contained" color-preset="error" @click="removeField(i)"/>
                            </HeFlex>
                            <HeFlex padding="1rem" gap="1rem">
                                <IodInput v-model="field.name" label="Name" @input="field.key = slugify(field.name, { ignore: ['*'] })" />
                                <IodInput v-model="field.key" label="API Name"/>

                                <div class="w-full flex flex-wrap items-center gap-2">
                                    <IodButton type="button" class="!h-8 !px-3 !normal-case !tracking-normal" :icon-left="iconFromRule(rule)" :label="labelFromRule(rule)" v-for="rule, rule_index in field.validation" size="xs" corner="pill" variant="contained" @click="field.validation.splice(rule_index, 1)"/>
                                    <VDropdown placement="top-start">
                                        <IodIconButton type="button" class="!w-12" icon="add" v-tooltip="'Neue Regel'" size="s" corner="pill"/>
        
                                        <template #popper>
                                            <ContextMenu class="min-w-64">
                                                <template v-for="rule in validation_rules">
                                                    <ContextMenuDivider v-if="rule.spacer" />
                                                    <ContextMenuItem v-else class="!min-h-10" :icon="rule.icon" @click="field.validation.push(rule.value)">{{ rule.name }}</ContextMenuItem>
                                                </template>
                                                <ContextMenuDivider/>
                                                <IodInput class="mx-4" label="Regel" v-model="customRule" @keydown.enter="field.validation.push(customRule); customRule = ''">
                                                    <template #right>
                                                        <IodIconButton type="button" icon="add" v-tooltip="'Hinzufügen'" size="s" variant="contained" @click="field.validation.push(customRule); customRule = ''" :disabled="!customRule"/>
                                                    </template>
                                                </IodInput>
                                            </ContextMenu>
                                        </template>
                                    </VDropdown>
                                </div>
                            </HeFlex>
                        </HeCard>
                    </div>

                    <IodAlert type="placeholder" class="h-40" text="Es wurden noch keine Felder angelegt" v-else />
                </HeFlex>
            </HeFlex>
        </HeCard>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    import { toast } from 'vue3-toastify'
    import type { Country } from '~/types/units'
    
    const NuxtLink = defineNuxtLink({})
    const scope = 'view_admin_forms_show'

    

    // Params
    const id = computed(() => useRoute().params.id ?? null)

    // Save function
    const save = id.value ? update : store



    const form = useForm({
        id: id.value,
        model: {
            name: '',
            slug: '',
            description: '',
            created_at: '',
            updated_at: '',
        },
        form_fields: [],
    })
    
    
    
    // START: Fields
    function addField() {
        form.form_fields.push({
            id: null,
            name: '',
            key: '',
            validation: [],
        })
    }

    function removeField(index: number) {
        form.form_fields.splice(index, 1)
    }
    // END: Fields



    // START: Server routes
    function fetch()
    {
        form.get(apiRoute('/api/forms/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
            },
        })
    }

    function store()
    {
        form
        .post(apiRoute('/api/forms'), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Formular wurde erstellt')
                navigateTo(apiRoute('/forms/editor/:id', { id: response.data?.id }))
            },
        })
    }

    function update()
    {
        form
        .patch(apiRoute('/api/forms/:id', { id: id.value }), {
            onSuccess(response: any)
            {
                form.defaults(response.data).reset()
                toast.success('Formular wurde aktualisiert')
            },
        })
    }
    // END: Server routes



    // START: Validation
    const validation_rules = [
        { value: 'required', name: 'Pflichtfeld', icon: 'priority_high' },
        { value: 'present', name: 'Vorhanden', icon: 'select' },
        { value: 'nullable', name: 'Optional', icon: 'question_mark' },
        { spacer: true },
        { value: 'string', name: 'Text', icon: 'text_fields' },
        { value: 'numeric', name: 'Nummer', icon: 'pin' },
        { value: 'date', name: 'Datum', icon: 'event' },
        { value: 'email', name: 'Email', icon: 'email' },
        { value: 'file', name: 'Datei', icon: 'cloud_upload' },
        { value: 'boolean', name: 'Ja/Nein', icon: 'toggle_on' },
        { value: 'confirmed', name: 'Bestätigung', icon: 'check_box' },
        { spacer: true },
        { value: 'alpha', name: 'a-z und A-Z', icon: 'text_fields' },
        { value: 'alpha_num', name: 'a-z, A-Z und 0-9', icon: 'text_fields' },
        { value: 'alpha_dash', name: 'a-z, A-Z, 0-9 und -_', icon: 'text_fields' },
    ]

    const customRule = ref('')

    function iconFromRule(rule: string)
    {
        return validation_rules.find(item => item.value === rule)?.icon || ''
    }

    function labelFromRule(rule: string)
    {
        return validation_rules.find(item => item.value === rule)?.name || rule
    }
    // END: Validation



    // Fetch model
    if (id.value) fetch()
</script>

<style lang="sass" scoped>
    .entity-grid
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))
        gap: 2rem

    .entity-card
        display: flex
        flex-direction: column
        align-items: stretch
        overflow: hidden
        box-shadow: none !important

        .entity-card-head
            position: relative
            height: 10rem
            background: var(--color-background-soft)

            .iod-button
                position: absolute
                top: 1rem
                right: 1rem

            .iod-icon
                font-size: 4rem
</style>
