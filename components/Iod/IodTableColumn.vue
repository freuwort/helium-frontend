<template>
    <div class="iod-container iod-table-column" v-tooltip="data.tooltip">
        <div class="image-wrapper" v-show="hasImage" :style="{color: data.color}">
            <img v-if="data.image" :src="data.image" alt="Image"/>
            <IodIcon v-else-if="data.icon" :icon="data.icon" />
        </div>
        <span class="text-wrapper" v-show="data.text">{{ data.text }}</span>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        data: {
            type: Object,
            default: () => ({
                text: '',
                tooltip: null,
                icon: null,
                color: null,
                image: null,
            })
        }
    })

    const hasImage = computed(() => !!props.data.image || !!props.data.icon)
</script>

<style lang="sass" scoped>
    .iod-container.iod-table-column
        display: flex
        align-items: center
        overflow: hidden
        padding-inline: 1rem
        gap: .75rem

        > .text-wrapper
            flex: 1
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            display: block
            padding-block: .25rem

        > .image-wrapper
            height: 1.75rem
            aspect-ratio: 1
            border-radius: 50%
            overflow: hidden
            flex-shrink: 0
            position: relative

            > img
                width: 100%
                height: 100%
                object-fit: cover
                display: block
                background-color: var(--color-background-soft)

            > .iod-icon
                height: 100%
                width: 100%
                font-size: 1.125rem
                position: relative !important

                &::after
                    content: ''
                    position: absolute
                    top: 0
                    left: 0
                    bottom: 0
                    right: 0
                    background-color: currentColor
                    pointer-events: none
                    opacity: .2
</style>