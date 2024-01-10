<template>
    <h5 class="margin-0 weight-medium">Firmen Einstellungen</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Firmenlogo</span>
            <small>Das Logo der Firma, welches in Helium angezeigt wird</small>
        </Flex>
        <IodButton class="w-18" label="Bild Hochladen"/>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Firmen Anzeigename</span>
            <small>Der Name der Firma, welcher in Helium angezeigt wird</small>
        </Flex>
        <IodInput label="Anzeigename" class="w-18"/>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Eingetragener Firmenname</span>
            <small>Der offizielle Name der Firma</small>
        </Flex>
        <IodInput label="Name" class="w-18" placeholder="Unternehmen GmbH"/>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Slogan</span>
            <small>Ein kurzer Slogan, welcher in Helium angezeigt wird</small>
        </Flex>
        <IodInput label="Slogan" class="w-18"/>
    </Flex>

    <div class="h-1"></div>

    <h5 class="margin-0 weight-medium">Standard Einheiten</h5>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Währung</span>
            <small>Wählen Sie Ihre standard Währung</small>
        </Flex>
        <select class="w-18">
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="CHF">CHF</option>
        </select>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Länge</span>
            <small>Wählen Sie Ihre standard Längeneinheit</small>
        </Flex>
        <select class="w-18">
            <option value="m">Meter</option>
            <option value="ft">Fuß</option>
        </select>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Temperatur</span>
            <small>Wählen Sie Ihre standard Temperatureinheit</small>
        </Flex>
        <select class="w-18">
            <option value="c">Celsius</option>
            <option value="f">Fahrenheit</option>
        </select>
    </Flex>
    <Flex horizontal>
        <Flex class="flex-1">
            <span class="font-heading color-text weight-medium">Geschwindigkeit</span>
            <small>Wählen Sie Ihre standard Geschwindigkeitseinheit</small>
        </Flex>
        <select class="w-18">
            <option value="kmh">km/h</option>
            <option value="mph">mph</option>
        </select>
    </Flex>
</template>

<script lang="ts" setup>
</script>

<style lang="sass" scoped></style>
