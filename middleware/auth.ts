export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if (!auth.session.authenticated)
    {
        return navigateTo(auth.routes.login, { replace: true })
    }
})
