export default defineNuxtConfig({
    css: [
        '~/assets/css/app.sass'
    ],

    modules: [
        'dayjs-nuxt',
        '@pinia/nuxt',
    ],
    
    devtools: {
        enabled: true
    },

    pinia: {
        storesDirs: ['./stores/**'],
    },
})
