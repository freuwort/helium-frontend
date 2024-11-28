import { MiddlewareManager } from "./classes/router/MiddlewareManager"
import middlewareConfig from './middleware.config'

export default defineNuxtConfig({
    hooks: {
        'pages:extend'(pages) {
            new MiddlewareManager()
            .setMapping(middlewareConfig.mapping)
            .applyTo(pages)
        },
    },

    vite: {
        css: {
            preprocessorOptions: {
                sass: {
                    api: 'modern',
                },
            },
        },
    },

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
        enabled: true,
    },

    pinia: {
        storesDirs: ['./stores/**'],
    },

    dayjs: {
        locales: ['de', 'en'],
        defaultLocale: 'de',
        plugins: ['relativeTime'],
    },

    runtimeConfig: {
        public: {
            backendUrl: process.env.BACKEND_URL ?? 'http://localhost:8000',
            frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
            websiteUrl: process.env.WEBSITE_URL ?? 'http://localhost:3001',
            screensUrl: process.env.SCREENS_URL ?? 'http://localhost:3002',
            adminPermissions: ['system.super-admin', 'system.admin'],
            superAdminPermissions: ['system.super-admin'],
        },
    },
    
    compatibilityDate: '2024-07-16',
})