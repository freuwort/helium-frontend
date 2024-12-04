<template>
    <div class="iod-container iod-breadcrumbs" :class="{ 'slot-left': $slots.left, 'slot-right': $slots.right }">
        <slot name="left" />
        <template v-for="(item, i) in items">
            <span v-show="i !== 0">/</span>
            <MediaDropzone class="rounded-full" :enabled="i !== items.length - 1" @drop.stop="onDrop($event, item.src_path)">
                <IodButton type="button" :class="{ 'first': i === 0 }" :icon-left="i === 0 ? 'home_storage' : ''" :label="item.text" size="s" variant="text" corner="pill" @click="emits('navigate', item.navigate_path)" />
            </MediaDropzone>
        </template>
        <HeSpacer />
        <slot name="right" />
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        path: {
            type: String,
            default: '',
        },
        rootPath: {
            type: String,
            default: '',
        },
    })

    const items = computed(() => {
        const items = []

        const parts = props.path.split('/').filter(e => e)

        let path = []

        for (const part of parts)
        {
            path.push(part)

            items.push({
                text: part,
                navigate_path: [props.rootPath, ...path].filter(e => e).join('/'),
                src_path: path.join('/'),
            })
        }

        return items
    })

    function onDrop(event: DragEvent, path: string)
    {
        emits('drop', {
            event: event as DragEvent,
            path: path as string
        })
    }

    const emits = defineEmits(['drop', 'navigate'])
</script>

<style lang="sass" scoped>
    .iod-container.iod-breadcrumbs
        display: flex
        align-items: center
        height: 2.5rem
        border-radius: 2.5rem
        background: var(--color-background-soft)
        user-select: none
        padding: .25rem

        &.slot-left
            padding-left: .75rem

        &.slot-right
            padding-right: .75rem

        .iod-button
            text-transform: none
            letter-spacing: 0
            font-weight: 400
            font-family: var(--font-text)
            padding-inline: .75rem !important
            gap: .5rem !important

            &.first
                font-weight: 600

        > span
            margin-inline: .25rem
            color: var(--color-border-focused)
</style>