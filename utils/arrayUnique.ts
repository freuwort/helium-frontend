export default function (array: string[]): string[] {
    return Array.from(new Set(array))
}