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

    pinia: {
        storesDirs: ['./stores/**'],
    },

    tailwindcss: {
        config: {
            theme: {
                extend: {
                    fontFamily: {
                        'heading': 'var(--font-heading)',
                        'text': 'var(--font-text)',
                        'mono': 'var(--font-mono)',
                        'icon': 'var(--font-icon)',
                        'brand': 'var(--font-brand)',
                    },
                    colors: {
                        'primary': 'var(--color-primary)',
                        'on-primary': 'var(--color-on-primary)',
                        'secondary': 'var(--color-secondary)',
                        'on-secondary': 'var(--color-on-secondary)',
                        'tertiary': 'var(--color-tertiary)',
                        'on-tertiary': 'var(--color-on-tertiary)',

                        'text': 'var(--color-text)',
                        'text-soft': 'var(--color-text-soft)',
                        'text-soft-disabled': 'var(--color-text-soft-disabled)',

                        'background': 'var(--color-background)',
                        'background-soft': 'var(--color-background-soft)',
                        'background-disabled': 'var(--color-background-soft-disabled)',

                        'border': 'var(--color-border)',
                        'border-focused': 'var(--color-border-focused)',
                        'border-disabled': 'var(--color-border-disabled)',

                        'info': 'var(--color-info)',
                        'on-info': 'var(--color-on-info)',
                        'success': 'var(--color-success)',
                        'on-success': 'var(--color-on-success)',
                        'warning': 'var(--color-warning)',
                        'on-warning': 'var(--color-on-warning)',
                        'error': 'var(--color-error)',
                        'on-error': 'var(--color-on-error)',
                    },
                },
            },
        },
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

    devtools: {
        enabled: true,
    },
})