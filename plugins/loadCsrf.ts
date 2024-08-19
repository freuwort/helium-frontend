export default defineNuxtPlugin({
    name: 'load-csrf',
    async setup()
    {
        await useAxios().get('/sanctum/csrf-cookie')
    }
})