<template>
    <div class="media-icon" :class="['type-'+ mediatype]" :style="{color: meta.color}">
        <IodIcon :icon="meta.icon"/>
    </div>
</template>

<script lang="ts" setup>
    const props = defineProps({
        mime: String,
    })

    const dict = {
        'file': { color: '#57606f', icon: 'widgets' },
        'folder': { color: '#57606f', icon: 'category' },

        'image': { color: '#3498db', icon: 'landscape' },
        'image/svg+xml': { color: '#e84393', icon: 'polyline' },

        'video': { color: '#8e44ad', icon: 'movie' },

        'audio': { color: '#F79F1F', icon: 'audiotrack' },

        'application/pdf': { color: '#F40F02', icon: 'category' },

        'text': { color: '#747d8c', icon: 'notes' },
        'text/html': { color: '#747d8c', icon: 'language' },
        'text/css': { color: '#264de4', icon: 'css' },
    }



    const mediatype = computed(() => {
        return props.mime === 'folder' ? 'folder' : 'file'
    })

    const meta = computed(() => {
        let generic = props.mime?.split('/')[0] as string

        if (dict.hasOwnProperty(props.mime as string))
        {
            // @ts-ignore
            return dict[props.mime]
        }

        if (dict.hasOwnProperty(generic))
        {
            // @ts-ignore
            return dict[generic]
        }

        return dict[mediatype.value]
    })
</script>

<style lang="sass" scoped>
    .media-icon
        text-align: center
        font-size: 1rem
        color: var(--color-primary)
        display: flex
        align-items: center
        justify-content: center
        position: relative
        overflow: hidden

        &.type-file
            aspect-ratio: 11/14
            width: 4.5em
            clip-path: polygon(0 0, calc(100% - 1em) 0, 100% 1em, 100% 100%, 0 100%)
            border-radius: .5em

            .iod-icon
                font-size: 3em

        &.type-folder
            aspect-ratio: 14/11
            height: 4.5em
            clip-path: polygon(0 0, calc(50% - .5em) 0, 50% .5em, calc(100% - .25em) .5em, 100% .75em, 100% 100%, 0 100%)
            border-radius: .5em
            padding-top: .5em

            .iod-icon
                font-size: 2.5em

        &::after
            content: ''
            position: absolute
            top: 0
            left: 0
            right: 0
            bottom: 0
            background: currentColor
            opacity: .2
            pointer-events: none
</style>