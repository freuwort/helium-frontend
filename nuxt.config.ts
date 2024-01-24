export default defineNuxtConfig({
    css: [
        '~/assets/css/app.sass'
    ],

    modules: [
        'dayjs-nuxt',
        '@pinia/nuxt',
        '@nuxt/test-utils/module',
    ],
    
    devtools: {
        enabled: true
    },

    pinia: {
        storesDirs: ['./stores/**'],
    },
})
