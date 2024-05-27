<template>
    <IodPopup ref="popup" :title="form?.name || 'Eigenschaften'">
        <HeFlex class="bg-background-soft aspect-video flex-none border-b" align-x="center">
            <img class="w-full h-full aspect-video object-contain bg-zinc-800 block" v-if="form.thumbnail" :src="form.thumbnail">
            <MediaIcon v-else :style="{scale: '1.25'}" :mime="(form.mime_type as string)" />
        </HeFlex>

        <HeFlex padding="1.5rem">
            <pre>{{JSON.stringify(form, null, 2)}}</pre>
        </HeFlex>
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