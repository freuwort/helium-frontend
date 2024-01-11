export default defineNuxtPlugin({
    name: 'load-csrf',
    async setup()
    {
        await useApiFetch('/sanctum/csrf-cookie')
    }
})