import { toast } from 'vue3-toastify'

export default {
    copy(text: string): void {
        navigator.clipboard.writeText(text)
        toast.success('In die Zwischenablage kopiert!')
    },
}