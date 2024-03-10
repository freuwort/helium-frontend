export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if (auth.authenticated) return navigateTo(auth.routes.authHome, { replace: true })
})
