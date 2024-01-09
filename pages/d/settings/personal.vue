<template>
    <h5 class="margin-0 weight-medium">Sprache, Zeitzone und Theme</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Sprache</span>
            <small>Wählen Sie die Programm Sprache</small>
        </Flex>
        <select class="w-18" v-model="form.language">
            <option value="de">Deutsch</option>
            <option value="en" disabled>Englisch</option>
        </select>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Zeitzone</span>
            <small>Wählen Sie Ihre Zeitzone</small>
        </Flex>
        <select class="w-18" v-model="form.timezone">
            <option value="Europe/Berlin">Europe/Berlin</option>
        </select>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Theme</span>
            <small>Wählen Sie Ihr lieblings Theme</small>
        </Flex>
        <select class="w-18" v-model="form.theme">
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
            <option value="system">System</option>
        </select>
    </Flex>

    <div class="h-1"></div>

    <h5 class="margin-0 weight-medium">Sicherheit</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Passwort</span>
            <small>Ändern Sie Ihr Passwort</small>
        </Flex>
        <IodButton label="Passwort ändern" size="small"/>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Zwei-Faktor-Authentifizierung</span>
            <small>Aktivieren Sie die Zwei-Faktor-Authentifizierung, um Ihr Konto zusätzlich zu schützen</small>
        </Flex>
        <IodButton label="Aktivieren" size="small"/>
    </Flex>

    <div class="h-1"></div>

    <h5 class="margin-0 weight-medium">Konto</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Konto löschen</span>
            <small>Wenn Sie Ihr Konto löschen, werden alle Ihre Daten gelöscht</small>
        </Flex>
        <IodButton label="Konto löschen" size="small" color-preset="error"/>
    </Flex>
</template>

<script lang="ts" setup>
    const form = ref({
        language: 'de',
        timezone: 'Europe/Berlin',
        theme: 'light',
    })
</script>

<style lang="sass" scoped></style>
