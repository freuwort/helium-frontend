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
    owner: BasicUser | null
    access: string | null
    shares: ModelHasMedia[]
    meta: {
        size?: number
        extension?: string
    }
    created_at: string | null
    updated_at: string | null
}

export type ModelHasMedia = {
    id: number
    media_id: number
    model_id: number
    model_type: string
    model: BasicUser | BasicRole | any
    type: string
    permission: string
}