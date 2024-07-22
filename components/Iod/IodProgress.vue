<template>
    <div class="iod-container iod-progress" :class="'loading-'+type">
        <svg class="circle" v-if="type === 'circle'" viewBox="25 25 50 50">
            <circle class="background-circle" cx="50" cy="50" r="20" fill="none" :stroke-width="thickness" stroke-linecap="round" stroke-miterlimit="10"/>
            <circle class="progress-circle" cx="50" cy="50" r="20" fill="none" :stroke-width="thickness" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset" stroke-linecap="round" stroke-miterlimit="10"/>
        </svg>
    
        <div v-if="type === 'bar'" class="bar">
            <div class="background-bar"></div>
            <div class="progress-bar" :style="`transform: scaleX(${progress / 100})`"></div>
            <!-- <div class="indeterminate-bar"></div> -->
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

    const dasharray = ref(124.85393524169922) // Trust me, this was a pain to calculate
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

            .background-circle
                stroke: currentColor
                opacity: .2

            .progress-circle
                stroke: currentColor
                transform-origin: 50px 50px
                transform: rotate(-90deg)

        .bar
            position: relative
            display: block
            height: 100%
            width: 100%
            border-radius: inherit
            color: inherit
            background: var(--color-background)
            overflow: hidden

            .background-bar
                position: absolute
                background-color: currentColor
                top: 0
                left: 0
                bottom: 0
                right: 0
                opacity: .2

            .progress-bar
                background-color: currentColor
                position: absolute
                top: 0
                bottom: 0
                left: 0
                right: 0
                transform-origin: left
                transform: scaleX(0)
</style>