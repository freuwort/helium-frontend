export const useSplashscreenStore = defineStore('splashscreen', () => {
    const status = ref('idle')
    const touched = ref(false)

    const isIdle = computed(() => status.value === 'idle')
    const isLoading = computed(() => status.value === 'loading')
    const isFinished = computed(() => status.value === 'finished')

    function reset()
    {
        status.value = 'idle'
        touched.value = true
    }

    function start()
    {
        status.value = 'loading'
        touched.value = true
    }
    
    function finish()
    {
        status.value = 'finished'
        touched.value = true

        setTimeout(reset, 600)
    }

    return {
        status,
        isIdle,
        isLoading,
        isFinished,
        touched,
        reset,
        start,
        finish,
    }
})