<template>
    <div class="iod-container iod-breadcrumbs">
        <NuxtLink
            class="breadcrumb"
            v-for="item in items"
            :key="item.navigate_path"
            :to="item.navigate_path"
            @dragover.prevent
            @drop.prevent="onDrop($event, item.src_path)"
        >
            <div class="label">{{ item.text }}</div>
        </NuxtLink>
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
                navigate_path: [props.rootPath, ...path].join('/'),
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

    const emits = defineEmits(['drop'])
</script>

<style lang="sass" scoped>
    .iod-container.iod-breadcrumbs
        display: flex
        align-items: center
        gap: 2rem
        padding-inline: .5rem
        user-select: none

        .breadcrumb
            background: transparent
            border: none
            display: flex
            align-items: center
            margin: 0
            gap: .5rem
            cursor: pointer
            font-size: 1rem
            text-decoration: none
            color: var(--color-text-soft)
            font-family: inherit
            position: relative
            padding: 0
            border: none
            outline: none

            &:hover
                color: var(--color-primary)

            &:not(.breadcrumb:first-child)::after
                content: 'chevron_right'
                position: absolute
                top: 50%
                left: -1rem
                color: #00000070
                transform: translate(-50%, -50%)
                user-select: none
                pointer-events: none
                font-family: var(--font-icon)

            &:first-child
                font-weight: 500

                &::before
                    content: 'home_storage'
                    user-select: none
                    pointer-events: none
                    font-family: var(--font-icon)
                    font-size: 1.5rem
</style>