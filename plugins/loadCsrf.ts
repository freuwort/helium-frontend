export default defineNuxtPlugin({
    name: 'load-csrf',
    async setup()
    {
        try {
            await useAxios().get('/sanctum/csrf-cookie')
        }
        catch(error) {
            console.log('Could not load CSRF token!')
        }
    }
})