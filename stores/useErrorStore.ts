type Error = {
    message: string,
    data?: any,
}



export const useErrorStore = defineStore('error', () => {
    const errors = ref<Error[]>([])

    function addError(error: Error)
    {
        errors.value.push(error)
    }

    function removeError(error: Error)
    {
        errors.value = errors.value.filter(e => e !== error)
    }

    return {
        errors,
        addError,
        removeError,
    }
})