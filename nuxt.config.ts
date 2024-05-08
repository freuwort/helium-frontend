export default defineNuxtConfig({
    css: [
        '~/assets/css/app.sass'
    ],

    modules: [
        'dayjs-nuxt',
        '@pinia/nuxt',
        '@nuxt/test-utils/module',
        "@nuxtjs/tailwindcss",
    ],
    
    devtools: {
        enabled: false,
    },

    pinia: {
        storesDirs: ['./stores/**'],
    },

    dayjs: {
        locales: ['de', 'en'],
        defaultLocale: 'de',
        plugins: ['relativeTime'],
    },
})