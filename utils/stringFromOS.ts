import type { Device } from "~/types/device"

export default function (device: Device|null): string {
    if (!device) return ''

    let result = ''
    
    switch (device.os_platform) {
        case 'win32': result += 'Windows'; break
    }

    switch (device.os_arch) {
        case 'x64': result += ' 64-bit'; break
        case 'x86': result += ' 32-bit'; break
    }

    return result
}