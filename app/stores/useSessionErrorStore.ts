import type { NuxtError } from "nuxt/app"

export const useSessionErrorStore = defineStore('session-error', () => {
    const errors = ref<NuxtError[]>([])

    // Clear errors on route change
    watch(() => useRoute().path, clearErrors, { immediate: true })

    function setError(error: NuxtError)
    {
        errors.value = [error]
    }

    function addError(error: NuxtError)
    {
        errors.value.push(error)
    }

    function removeError(error: NuxtError)
    {
        errors.value = errors.value.filter(e => e !== error)
    }

    function clearErrors()
    {
        errors.value = []
    }

    function hasErrors()
    {
        return errors.value.length > 0
    }

    return {
        errors,
        setError,
        addError,
        removeError,
        clearErrors,
        hasErrors,
    }
})