<template>
    <component :is="is" type="button" class="profile-chip">
        <img class="pictogram image" :style="{'order': imageOrder}" :src="image" v-if="image">
        <IodIcon class="pictogram icon" :icon="icon" v-show="icon" :style="{color}" v-else-if="icon"/>

        <Flex class="content" :x-align="horizontalAlign">
            <span class="name">{{ title }}</span>
            <span class="subtitle" v-show="subtitle">{{ subtitle }}</span>
        </Flex>

        <slot></slot>
    </component>
</template>

<script lang="ts" setup>
    const props = defineProps({
        image: {
            type: String,
            default: '',
        },
        icon: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        subtitle: {
            type: String,
            default: '',
        },
        is: {
            default: 'button',
        },
        align: {
            type: String,
            default: 'left',
        },
        showImage: {
            type: Boolean,
            default: false,
        },
    })

    const imageOrder = computed(() => props.align === 'left' ? 0 : 1)
    const horizontalAlign = computed(() => props.align === 'left' ? 'flex-start' : 'flex-end')
</script>

<style lang="sass" scoped>
    .profile-chip
        display: flex
        align-items: center
        gap: 1rem
        padding-inline: 1rem
        user-select: none
        border-radius: .5rem
        transition: all 80ms ease-in-out
        --local-image-height: 100%

        &:hover
            background-color: var(--color-background-soft)

        .content
            flex: 1

    .name
        font-weight: 600
        color: var(--color-text)
        line-height: 1.25rem

    .subtitle
        font-size: .625rem
        font-weight: 400
        color: var(--color-text-soft)
        line-height: 1rem

    .pictogram
        aspect-ratio: 1
        height: var(--local-image-height)
        border-radius: 50%

        &.image
            object-fit: cover
            object-position: center
            border: 1px solid var(--color-background-soft)

        &.icon
            position: relative
            overflow: hidden

            &::before
                content: ''
                position: absolute
                top: 0
                left: 0
                right: 0
                bottom: 0
                background: currentcolor
                opacity: .15
                pointer-events: none
</style>
