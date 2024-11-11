import type { BasicAddress } from "~/types/address"

export default function (address: BasicAddress|null): string {
    if (!address) return ''
    return [
        [address.address_line_1, address.address_line_2].filter(i => i).join(' '),
        [address.postal_code, address.city].filter(i => i).join(' '),
        [address.state, address.country_code].filter(i => i).join(' '),
    ].filter(i => i).join(', ')
}