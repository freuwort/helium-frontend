<template>
    <div class="flex flex-col w-64">
        <!-- <pre class="text-xs" v-html="JSON.stringify(editor.content, null, 2)"></pre> -->
        <LayerElement v-for="element in editor.content" :key="element.elementId" :element="element" :editor/>
    </div>
</template>

<script lang="ts" setup>
    import LayerElement from './LayerElement.vue'

    const props = defineProps({
        editor: {
            type: Object,
            required: true,
        }
    })
</script>