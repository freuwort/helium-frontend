import type { BasicAddress } from "~/types/address"
import type { BasicUser } from "~/types/user"

export type Device = {
    id: number
    type: string
    name: string
    group: string
    owner: BasicUser|null
    address: BasicAddress|null
    os_platform: string
    os_arch: string
    os_release: string
    app_version: string
    created_at: string
    updated_at: string
}