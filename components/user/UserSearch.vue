<template>
    <div class="user-search">
        <IodInput type="search" :label="label" :placeholder="placeholder" v-model="form.filter.search" @update:modelValue="search()" @focus="focus = true" @blur="focus = false" />

        <Card class="autocomplete small-scrollbar" v-show="focus && !!form.filter.search.length">
            <IodLoader type="bar" v-show="form.processing" />
            <ProfileChip class="profile" :user="user" show-subtitle v-for="user in results" @mousedown="select(user)" />
            <IodAlert class="h-4" as="placeholder" v-if="!results.length && form.filter.search.length">Keine Ergebnisse gefunden</IodAlert>
        </Card>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        label: String,
        placeholder: String,
    })

    const emits = defineEmits(['select'])

    const form = useForm({
        filter: {
            search: '',
        },
    })

    const results = ref([])
    const focus = ref(false)



    function search() {
        if (!form.filter.search.length) return
        
        form.get(apiRoute('/api/users/basic', {
            filter: form.filter
        }), {
            onSuccess(response: any) {
                results.value = response.value.data
            }
        })
    }



    function select(user: any)
    {
        emits('select', user)
        form.filter.search = ''
        results.value = []
    }
</script>

<style lang="sass" scoped>
    .user-search
        position: relative

        .iod-input
            position: relative
            z-index: 10

    .autocomplete
        position: absolute
        left: 0
        right: 0
        top: 100%
        z-index: 10
        display: flex
        flex-direction: column
        gap: .25rem
        padding-block: 1rem
        min-width: 16rem
        max-height: 18rem
        overflow-y: auto
        border-radius: var(--radius-m)

        .profile
            border-radius: 0
            flex: none
            height: 3rem
            padding-inline: 1rem !important
</style>