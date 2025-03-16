<template>
    <div>
        {{ element.name }}

        <div class="pl-2" v-for="slot, slotName in element.slots">
            {{ slotName }}
            <LayerElement v-for="element in slot" :element="element" :editor="editor"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import LayerElement from './LayerElement.vue'

    const props = defineProps({
        element: {
            type: Object,
            required: true,
        },
        editor: {
            type: Object,
            required: true,
        }
    })

    // const typeKey = computed(() => {
    //     return props.editor.systemProperties.typeKey
    // })

    // const prototype = computed(() => {
    //     return props.editor.getPrototypeElement(props.element[typeKey.value])
    // })

    // const slots = computed(() => {
    //     return props.element.slot
    // })
</script>