<template>
    <div class="profile-card">
        <div class="profile-banner" :style="{ backgroundImage: `url(${banner})` }">
            <IodIconButton v-if="allowBannerUpload" class="overlay-button" type="button" size="xl" corner="l" icon="upload" :aria-label="bannerTooltip" @click="$emit('upload:banner')" />
            
            <VDropdown v-if="showActions" placement="bottom-end">
                <IodButton type="button" size="s" label="Bearbeiten" corner="pill" variant="contained" background="var(--color-background)" />
    
                <template #popper>
                    <slot name="actions" />
                </template>
            </VDropdown>
        </div>

        <div class="profile-image">
            <img :src="avatar" :alt="title" v-if="avatar">
            <IodIconButton v-if="allowAvatarUpload" class="overlay-button" type="button" size="xl" corner="pill" icon="upload" :aria-label="avatarTooltip" @click="$emit('upload:avatar')" />
        </div>

        <div class="profile-info">
            <h2>{{ title }}</h2>
            <p v-if="subtitle">{{ subtitle }}</p>
            <slot name="info"></slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        banner: {
            type: String,
            default: '/images/app/default/user_banner.jpg',
        },
        avatar: {
            type: String,
            default: null,
        },
        title: {
            type: String,
        },
        subtitle: {
            type: String,
        },
        showActions: {
            type: Boolean,
            default: false,
        },
        allowAvatarUpload: {
            type: Boolean,
            default: false,
        },
        allowBannerUpload: {
            type: Boolean,
            default: false,
        },
        avatarTooltip: {
            type: String,
            default: 'Profilbild hochladen',
        },
        bannerTooltip: {
            type: String,
            default: 'Banner hochladen',
        },
    })

    defineEmits(['upload:avatar', 'upload:banner'])
</script>

<style lang="sass" scoped>
    .profile-card
        width: 100%
        display: flex
        flex-direction: column
        align-items: start
        overflow: hidden

        .overlay-button.iod-button
            opacity: 0
            position: absolute
            top: 5px
            bottom: 5px
            left: 5px
            right: 5px
            width: auto
            height: auto
            z-index: 2
            --local-color-text: white
            --local-color-background: #00000090
            transition: all 100ms

            &:hover
                opacity: 1

        .profile-banner
            width: 100%
            height: 7rem
            position: relative
            z-index: 1
            display: flex
            align-items: flex-end
            justify-content: flex-end
            padding: 1rem
            background-size: cover
            background-position: center
            background-repeat: no-repeat
            background-color: var(--color-background-soft)

        .profile-image
            width: 6rem
            height: 6rem
            margin-inline: .5rem
            margin-top: -3rem
            border-radius: 50%
            background: var(--color-background)
            position: relative
            z-index: 2

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
                border-radius: 0 0 var(--radius-l) 0
                box-shadow: .75rem .75rem 0 var(--color-background)

            &::after
                left: calc(100% - 1px)
                border-radius: 0 0 0 var(--radius-l)
                box-shadow: -.75rem .75rem 0 var(--color-background)

            img
                width: 100%
                height: 100%
                object-fit: cover
                border-radius: 50%
                border: 3px solid var(--color-background)
                position: relative
                z-index: 1

        .profile-info
            width: 100%
            display: flex
            flex-direction: column
            align-items: start
            padding-inline: 1rem
            padding-block: .5rem 1rem

            h2
                margin: 0
                font-size: 1rem
                font-weight: 600

            p
                margin: 0
                font-size: .875rem
</style>