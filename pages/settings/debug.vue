<template>
    <div class="flex items-center min-h-10">
        <h3 class="flex-1 m-0 font-medium">Debug</h3>
        <IodButton @click="fetch()" icon-left="refresh" corner="pill" label="Aktualisieren"/>
    </div>

    <iframe :src="form.phpinfo_url"></iframe>
    <HeSpacer />

    <div class="flex items-center min-h-10">
        <h3 class="flex-1 m-0 font-medium">Domain Settings</h3>
    </div>

    <pre v-html="JSON.stringify(form.settings, null, 2)"></pre>
</template>

<script lang="ts" setup>
    const form = useForm({})

    async function fetch() {
        form.get('/api/debug', {
            onSuccess(response: any) {
                form.defaults(response).reset()
            },
        })
    }

    fetch()
</script>

<style lang="sass" scoped>
    iframe
        aspect-ratio: 16 / 9
        width: 100%
        zoom: .75
        border: 1px solid var(--color-border)
        border-radius: var(--radius-l)
</style>
