<template>
    <div class="profile-card">
        <div class="profile-banner" :style="{ backgroundImage: `url(${banner})` }"></div>
        <div class="profile-image">
            <img :src="image" :alt="title">
        </div>
        <div class="profile-info">
            <h2>{{ title }}</h2>
            <p v-if="subtitle">{{ subtitle }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        banner: {
            type: String,
            default: '/images/app/default/user_banner.jpg',
        },
        image: {
            type: String,
            default: '/images/app/default/user_image.jpg',
        },
        title: {
            type: String,
        },
        subtitle: {
            type: String,
        },
    })
</script>

<style lang="sass" scoped>
    .profile-card
        width: 100%
        display: flex
        flex-direction: column
        align-items: center
        text-align: center
        overflow: hidden

        .profile-banner
            width: 100%
            height: 12rem
            background-size: cover
            background-position: center
            background-repeat: no-repeat
            background-color: var(--color-background-soft)

        .profile-image
            width: 10rem
            height: 10rem
            margin-top: -5rem
            border-radius: 50%
            background: var(--color-background)
            position: relative

            &::before,
            &::after
                content: ''
                position: absolute
                bottom: 50%
                width: 1.5rem
                height: 1.5rem
                background: transparent
                pointer-events: none

            &::before
                right: calc(100% - 1px)
                border-radius: 0 0 var(--radius-xl) 0
                box-shadow: .75rem .75rem 0 var(--color-background)

            &::after
                left: calc(100% - 1px)
                border-radius: 0 0 0 var(--radius-xl)
                box-shadow: -.75rem .75rem 0 var(--color-background)

            img
                width: 100%
                height: 100%
                object-fit: cover
                border-radius: 50%
                border: 5px solid var(--color-background)
                position: relative
                z-index: 1

        .profile-info
            width: 100%
            display: flex
            flex-direction: column
            align-items: center
            padding-block: 1rem 2rem

            h2
                margin: 0
                font-size: 1.5rem
                font-weight: 600

            p
                margin: 0
</style>