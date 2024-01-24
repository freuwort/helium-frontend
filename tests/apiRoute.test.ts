import { test, expect } from 'vitest'

test('leaves route without parameters as is',() => {
    const path = '/api/users'
    const params = {}
    const route = apiRoute(path, params)

    expect(route).toBe('/api/users')
})

test('replaces parameter in route',() => {
    const path = '/api/users/:id'
    const params = { id: 1 }
    const route = apiRoute(path, params)

    expect(route).toBe('/api/users/1')
})

test('adds additional parameters as query string',() => {
    const path = '/api/users/:id'
    const params = { id: 1, name: 'John' }
    const route = apiRoute(path, params)

    expect(route).toBe('/api/users/1?name=John')
})

test('removes unused parameters from route',() => {
    const path = '/api/users/:id/:age'
    const params = { id: 1 }
    const route = apiRoute(path, params)

    expect(route).toBe('/api/users/1/')
})