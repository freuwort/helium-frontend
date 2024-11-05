export default function findCommonItems(arrays: string[][]): string[] {
    if (arrays.length === 0) return []

    let commonItems = new Set(arrays[0])

    for (let i = 1; i < arrays.length; i++) {
        commonItems = new Set([...commonItems].filter(item => arrays[i].includes(item)))
    }

    return Array.from(commonItems)
}