<template>
    <IodPopup ref="popup" :title="form?.name || 'Eigenschaften'">
        <Flex class="background-soft aspect-ratio-16-9 flex-none border-bottom" x-align="center">
            <MediaIcon :style="{scale: '1.25'}" :mime="(form.mime_type as string)" />
        </Flex>

        <Flex padding="1.5rem">
            <pre>{{JSON.stringify(form, null, 2)}}</pre>
        </Flex>
    </IodPopup>
</template>

<script lang="ts" setup>
    import type { MediaItem } from '~/types/media'
    

    
    const popup = ref()
    const form = useForm({} as MediaItem)

    function open(item: MediaItem)
    {
        form.defaults(item).reset()
        popup.value.open()
    }

    defineExpose({ open })
</script>

<style lang="sass" scoped>
</style>