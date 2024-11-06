export default function (arrays: string[][]): string[] {
    if (arrays.length === 0) return []

    let commonItems = new Set(arrays[0])

    for (let i = 1; i < arrays.length; i++) {
        commonItems = commonItems.intersection(new Set(arrays[i]))
    }

    return Array.from(commonItems)
}