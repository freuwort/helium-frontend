export default defineNuxtConfig({
    css: [
        '~/assets/css/app.sass'
    ],

    modules: [
        'dayjs-nuxt',
        'floating-vue/nuxt',
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

    compatibilityDate: '2024-07-16',

    runtimeConfig: {
        public: {
            backendUrl: `https://${process.env.BACKEND_DOMAIN ?? 'localhost:8000'}`,
            frontendUrl: `https://${process.env.FRONTEND_DOMAIN ?? 'localhost:3000'}`,
            websiteUrl: `https://${process.env.WEBSITE_DOMAIN ?? 'localhost:3001'}`,
            screensUrl: `https://${process.env.SCREENS_DOMAIN ?? 'localhost:3002'}`,
        },
    },
})