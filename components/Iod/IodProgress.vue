<template>
    <div class="iod-container iod-progress" :class="'loading-'+type">
        <svg v-if="type === 'circle'" class="circle" viewBox="25 25 50 50">
            <circle ref="circlePath" cx="50" cy="50" r="20" fill="none" :stroke-width="thickness" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset" stroke-linecap="round" stroke-miterlimit="10"/>
        </svg>
    
        <div v-if="type === 'bar'" class="bar">
            <div class="progress" :style="`transform: scaleX(${progress / 100})`"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        type: {
            type: String,
            default: 'circle',
        },
        thickness: {
            type: Number,
            default: 4,
        },
        progress: {
            type: Number,
            default: 0,
        },
    })

    const circlePath = ref()
    const dasharray = computed(() => {
        return 60
    })
    const dashoffset = computed(() => dasharray.value * (1 - props.progress / 100))
</script>

<style lang="sass" scoped>
    .iod-container.iod-progress
        display: flex
        justify-content: stretch
        align-items: stretch

        &.loading-circle
            height: 2rem
            width: 2rem

        &.loading-bar
            height: 3px
            width: 100%

        .circle
            height: 100%
            width: 100%
            margin: 0
            flex: none
            user-select: none
            color: currentColor
            box-sizing: border-box

            *
                box-sizing: inherit

            circle
                stroke: currentColor

        .bar
            position: relative
            display: block
            height: 100%
            width: 100%
            color: var(--color-text)
            background: var(--color-background)
            overflow: hidden

            &:before
                content: ''
                position: absolute
                background-color: currentColor
                top: 0
                left: 0
                bottom: 0
                right: 0
                opacity: .2

            .progress
                background-color: currentColor
</style>