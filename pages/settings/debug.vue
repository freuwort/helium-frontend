<template>
    <SettingsTitle>
        <div class="flex items-center">
            <span class="flex-1">Debug</span>
            <IodButton @click="fetch()" icon-left="refresh" corner="pill" label="Aktualisieren"/>
        </div>
    </SettingsTitle>

    <SettingsTitle is="h6" title="PHP Info"/>
    <iframe :src="form.phpinfo_url"></iframe>

    <SettingsTitle is="h6" title="Domain Settings"/>
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
