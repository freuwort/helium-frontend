<template>
    <div class="iod-container iod-table-column" :class="{'monospace': monospace}" v-tooltip="data.tooltip || data.text">
        <IodIcon
            class="pictogram"
            lazy
            v-show="!!data.image || !!data.icon"
            :image="data.image"
            :icon="data.icon"
            :color="data.color"
            :alt="(data.text || data.tooltip || 'icon')+''"
            />
        <span class="text-wrapper" v-show="data.text">{{ data.text }}</span>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        data: {
            type: Object,
            default: () => ({
                text: '',
                tooltip: null,
                icon: null,
                color: null,
                image: null,
            })
        },
        monospace: {
            type: Boolean,
            default: false,
        },
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-table-column
        display: flex
        align-items: center
        overflow: hidden
        padding-inline: .5rem
        gap: .5rem

        &.monospace
            font-family: var(--font-mono)

        > .text-wrapper
            flex: 1
            white-space: nowrap
            overflow: hidden
            text-overflow: ellipsis
            display: block
            padding-block: .25rem

        > .pictogram
            height: 1.25rem
            font-size: 1rem
            border-radius: 50%
            flex-shrink: 0
</style>