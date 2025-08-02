export default defineNuxtPlugin({
    name: 'load-csrf',
    async setup()
    {
        try {
            await useAxios().get('/api/csrf-cookie')
        }
        catch(error) {
            throw createError({ statusCode: 500, statusMessage: 'Could not load CSRF token! Is the API service running?' })
        }
    }
})