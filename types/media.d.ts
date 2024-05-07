import type { BasicUser } from "./user"
import type { BasicRole } from "./role"

export type MediaItem = {
    id: number
    parent_id: number | null
    drive: string | null
    src_path: string
    thumbnail_path: string | null
    cdn_path: string | null
    mime_type: string | null
    name: string
    access: string | null
    users: BasicUser[]
    roles: BasicRole[]
    meta: {
        size?: number
        extension?: string
    }
    created_at: string | null
    updated_at: string | null
}