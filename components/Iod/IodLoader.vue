<template>
    <svg class="iod-container iod-loader" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" :stroke-width="thickness" stroke-linecap="round" stroke-miterlimit="10"/>
    </svg>
</template>

<script setup lang="ts">
    defineProps({
        type: {
            type: String,
            default: 'spinner',
        },
        thickness: {
            type: Number,
            default: 5,
        },
    })
</script>

<style lang="sass" scoped>
    .iod-container.iod-loader
        height: 2rem
        width: 2rem
        animation: rotate 2s linear infinite
        transform-origin: center center
        margin: 0
        flex: none
        user-select: none
        color: currentColor
        box-sizing: border-box

        *
            box-sizing: inherit

        .path
            stroke: currentColor
            stroke-dasharray: 1, 200
            stroke-dashoffset: 0
            animation: dash 1.5s ease-in-out infinite

        @keyframes rotate
            100%
                transform: rotate(360deg)
                
        @keyframes dash
            0%
                stroke-dasharray: 1, 200
                stroke-dashoffset: 0
            50%
                stroke-dasharray: 89, 200
                stroke-dashoffset: -35px
            100%
                stroke-dasharray: 89, 200
                stroke-dashoffset: -124px
</style>