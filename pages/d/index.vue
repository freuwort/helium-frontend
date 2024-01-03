<script lang="ts" setup>
    useHead({
        title: 'Startseite',
    })

    definePageMeta({
        layout: 'auth-default',
    })
</script>

<template>
    <div class="limiter">
        <Card @submit.prevent>
            <Layout :gap="2" :padding="2">
            </Layout>
        </Card>
    </div>
</template>

<style scoped></style>
