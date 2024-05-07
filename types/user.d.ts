export type BasicUser = {
    id: number
    name: string | null
    username: string | null
    profile_image: string | null
    pivot?: {
        role: string | null
    }
}