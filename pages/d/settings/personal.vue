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
            <option value="pst">PST (UTC-8)</option>
            <option value="mst">MST (UTC-7)</option>
            <option value="cst">CST (UTC-6)</option>
            <option value="est">EST (UTC-5)</option>
            <option value="ast">AST (UTC-4)</option>
            <option value="brt">BRT (UTC-3)</option>
            <option value="gmt">GMT (UTC+0)</option>
            <option value="cet">CET (UTC+1)</option>
            <option value="eet">EET (UTC+2)</option>
            <option value="msk">MSK (UTC+3)</option>
            <option value="ist">IST (UTC+5:30)</option>
            <option value="sgt">SGT (UTC+8)</option>
            <option value="jst">JST (UTC+9)</option>
            <option value="aest">AEDT (UTC+11)</option>
            <option value="nzst">NZDT (UTC+13)</option>
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
        timezone: 'cet',
        theme: 'light',
    })
</script>

<style lang="sass" scoped></style>
