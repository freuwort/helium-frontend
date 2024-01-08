export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if (auth.isLoggedIn) return navigateTo('/d', { replace: true })
})
