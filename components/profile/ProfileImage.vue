<template>
    <div class="profile-image" :style="{ aspectRatio: aspect}">
        <img :src :alt v-if="src">
        <IodIconButton v-if="allowUpload" class="overlay-button" type="button" size="xl" icon="upload" v-tooltip="tooltip" @click="$emit('upload')" />
        <div class="overlay-loader" v-show="loading">
            <IodLoader type="spinner" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps({
        src: {
            type: String,
            default: null,
        },
        alt: {
            type: String,
            default: 'Profil Bild',
        },
        allowUpload: {
            type: Boolean,
            default: false,
        },
        tooltip: {
            type: String,
            default: 'Bild hochladen',
        },
        aspect: {
            type: String,
            default: '1/1',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    })

    defineEmits(['upload'])
</script>

<style lang="sass" scoped>
    .profile-image
        border-radius: var(--radius-m)
        position: relative
        object-fit: contain

        img
            width: 100%
            height: 100%
            object-fit: inherit
            border-radius: inherit
            position: relative
            z-index: 1

        .overlay-button.iod-button
            opacity: 0
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            width: auto
            height: auto
            z-index: 2
            border-radius: inherit
            --local-color-text: white
            --local-color-background: #00000090
            transition: all 100ms

            &:hover
                opacity: 1
        
        .overlay-loader
            position: absolute
            top: 0
            bottom: 0
            left: 0
            right: 0
            width: auto
            height: auto
            z-index: 3
            border-radius: inherit
            background: #00000090
            color: white
            display: flex
            align-items: center
            justify-content: center
</style>