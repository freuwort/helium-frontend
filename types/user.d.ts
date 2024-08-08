export type BasicUser = {
    id: number
    name: string | null
    username: string | null
    avatar: string | null
    banner: string | null
    pivot?: {
        role: string | null
    }
}