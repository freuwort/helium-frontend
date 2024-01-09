<template>
    <Flex :is="is" type="button" class="chip" horizontal gap="1rem" padding="0 1rem" v-if="auth.user">
        <img class="image" :style="{'order': imageOrder}" :src="auth.user.image">

        <Flex :x-align="horizontalAlign">
            <span class="name">{{ auth.user.name }}</span>
            <span class="company" v-show="showCompany" v-if="domain.companyMeta">{{ domain.companyMeta.name }}</span>
        </Flex>
    </Flex>
</template>

<script lang="ts" setup>
    const auth = useAuthStore()
    const domain = useDomainStore()

    const props = defineProps({
        is: {
            default: 'button',
        },
        align: {
            type: String,
            default: 'left',
        },
        showCompany: {
            type: Boolean,
            default: false,
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
    .chip
        height: 100%
        user-select: none
        border-radius: .5rem
        transition: all 80ms ease-in-out

        &:hover
            background-color: var(--color-background-soft)

    .name
        font-weight: 600
        color: var(--color-text)
        line-height: 1.25rem

    .company
        font-size: .625rem
        font-weight: 400
        color: var(--color-text-soft)
        line-height: 1rem

    .image
        width: 2.5rem
        height: 2.5rem
        border-radius: 50%
        object-fit: cover
        object-position: center
        border: 1px solid var(--color-background-soft)
</style>
