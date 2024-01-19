<template>
    <div>
        <h1>Redirecting...</h1>
    </div>
</template>
<script lang="ts" setup>
    // redirect to login
    navigateTo('/login', { replace: true })
</script>