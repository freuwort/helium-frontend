import { test, expect } from 'vitest'

test('flattens object',() => {
    const object = {
        a: {
            b: {
                c: 1
            }
        }
    }

    const flattenedObject = flattenObject(object)

    expect(flattenedObject).toEqual({ 'a.b.c': 1 })
})

test('flattens object with arrays',() => {
    const object = {
        a: {
            b: {
                c: [1, 2, 3]
            }
        }
    }

    const flattenedObject = flattenObject(object)

    expect(flattenedObject).toEqual({ 'a.b.c[0]': 1, 'a.b.c[1]': 2, 'a.b.c[2]': 3})
})