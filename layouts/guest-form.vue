<script lang="ts" setup>
    useHead({
        title: 'Anmelden',
        bodyAttrs: {
            class: 'background-soft'
        }
    });
</script>

<template>
    <main>
        <header>
            <img src="https://ui-avatars.com/api/?name=alexander+koppel&background=3737FA&color=1d1dab&size=128" alt="">
            <h2>Unternehmen GmbH</h2>
        </header>
        <slot />
    </main>
  <div>
  </div>
</template>

<style scoped lang="sass">
header
    background-color: var(--color-text)
    background-image: url('/public/images/app/banner_pattern_light.png')
    background-size: auto 100%
    color: var(--color-background)
    min-height: 400px
    padding-bottom: 4rem
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    gap: 1rem
    margin-bottom: -4rem

    img
        width: 128px
        height: 128px
        border-radius: 50%
        object-fit: cover
        border: 5px solid var(--color-background)
        box-shadow: var(--shadow-elevation-low)
        background-color: var(--color-background)

    h2
        margin: 0
        font-size: 1.5rem
        font-weight: 500
        text-align: center
        color: inherit
</style>
