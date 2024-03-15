export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if (!auth.session.twoFactorVerified)
    {
        return navigateTo(auth.routes.verify2FA, { replace: true })
    }
})
