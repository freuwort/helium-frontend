<template>
    <IodPopup ref="popup" :title="form?.name || 'Eigenschaften'">
        <div class="flex items-center justify-center bg-background-soft aspect-video flex-none border-b">
            <img class="w-full h-full aspect-video object-contain bg-zinc-800 block" v-if="form.thumbnail" :src="form.thumbnail">
            <MediaIcon v-else :style="{scale: '1.25'}" :mime="(form.mime_type as string)" />
        </div>

        <div class="flex flex-col py-4 gap-2">
            <div class="property-row" v-if="form.name">
                <span class="col">Name</span>
                <span class="col">{{form.name}}</span>
            </div>
            <div class="property-row" v-if="form.src_path">
                <span class="col">System-Pfad</span>
                <NuxtLink class="col" :to="form.cdn_path" target="_blank">{{form.src_path}}</NuxtLink>
            </div>
            <div class="property-row" v-if="form.created_at">
                <span class="col">Hochgeladen am</span>
                <span class="col">{{$dayjs(form.created_at).format('dddd – DD. MMM YYYY – HH:mm')}}</span>
            </div>
            <div class="property-row" v-if="form.updated_at && form.updated_at != form.created_at">
                <span class="col">Geändert am</span>
                <span class="col">{{$dayjs(form.updated_at).format('dddd – DD. MMM YYYY – HH:mm')}}</span>
            </div>
            <div class="property-row" v-if="form.mime_type || form.meta?.extension">
                <span class="col">Typ</span>
                <span class="col" v-if="form.mime_type && form.mime_type == 'directory'">Ordner</span>
                <span class="col" v-else-if="form.meta?.extension">{{form.meta?.extension?.toUpperCase()}}</span>
                <span class="col" v-else>{{form.mime_type}}</span>
            </div>
            <div class="property-row" v-if="form.meta?.size">
                <span class="col">Größe</span>
                <span class="col">{{humanFileSize(form.meta?.size)}}</span>
            </div>
        </div>
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
    .property-row
        display: flex
        align-items: center
        padding-inline: 1rem
        min-height: 2rem
        gap: 1rem

        .col
            display: flex
            align-items: center
            color: var(--color-text)

        .col:first-child
            width: 8rem
            justify-content: flex-end
            color: var(--color-text-soft)

        .col:last-child
            flex: 1
            font-weight: 500

        a.col
            color: var(--bg-blue-500)

        a.col:hover
            color: var(--bg-blue-600)
            text-decoration: underline
</style>