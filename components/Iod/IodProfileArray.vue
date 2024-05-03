<template>
    <div class="iod-container iod-profile-array" v-tooltip="tooltip">
        <span class="item" v-if="showAdditionalCount" :style="{zIndex: limit + 1}">+{{ data.length - limit }}</span>
        <template v-for="(item, i) in data.slice(0, limit)">
            <img class="item" :src="item.image" :alt="item.label" :style="{zIndex: limit - i}">
        </template>
    </div>
</template>

<script lang="ts" setup>
    type Profile = {
        image: string,
        label: string,
    }

    const props = defineProps({
        data: {
            type: Array as PropType<Profile[]>,
            default: () => [],
        },
        limit: {
            type: Number,
            default: 3,
        },
    })

    const showAdditionalCount = computed(() => props.data.length > props.limit)
    const limit = computed(() => showAdditionalCount.value ? props.limit - 1 : props.limit)

    const tooltip = computed(() => props.data.map(item => item.label).join(', '))
</script>

<style lang="sass" scoped>
    .iod-container.iod-profile-array
        --local-color-background: var(--color-background)
        --local-inset: -.75rem

        height: 2rem
        display: flex
        align-items: center
        font-size: .8rem

        .item
            position: relative
            height: 100%
            aspect-ratio: 1
            object-fit: cover
            border-radius: 100vh
            box-shadow: 0 0 0 2px var(--local-color-background)
            background: var(--color-background-soft)
            margin-left: var(--local-inset)
            user-select: none

            &:not(img)
                display: flex
                align-items: center
                justify-content: center
                color: var(--color-text)
                font-size: inherit
                line-height: 1
                font-weight: 600
                white-space: nowrap
                overflow: hidden
                text-overflow: ellipsis
                padding: .5rem

            &:first-child
                margin-left: 0
                
</style>