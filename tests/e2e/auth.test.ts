import { describe, test, expect } from 'vitest'
import { setup, $fetch, url, createPage } from '@nuxt/test-utils/e2e'

describe('An unauthenticated user:', async () => {
    await setup({
        server: true,
        browser: true,
        browserOptions: {
            type: 'chromium',
            launch: {
                headless: false,
            },
        },
    })

    
    test('can visit the login page', async () => {
        const page = await createPage('/login')
        expect(page.url()).toBe(url('/login'))
    })

    test('can visit the register page', async () => {
        const page = await createPage('/register')
        expect(page.url()).toBe(url('/register'))
    })

    test('can visit the forget password page', async () => {
        const page = await createPage('/forget-password')
        expect(page.url()).toBe(url('/forget-password'))
    })

    test('can not visit the dashboard', async () => {
        const page = await createPage('/')
        expect(page.url()).toBe(url('/login'))
    })
})