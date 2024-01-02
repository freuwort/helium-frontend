<script lang="ts" setup>
    import zxcvbn from 'zxcvbn'
</script>

<template>
    <div class="form-limiter">
        <div class="flex vertical gap-2 padding-2 shadow-low background radius-l border-soft">
            <IodInput label="Email"/>
            <IodInput label="Passwort" type="password" show-password-score :password-score-function="zxcvbn"/>
            <IodButton label="Senden" size="large"/>
        </div>
    </div>
</template>

<style scoped lang="sass"></style>
