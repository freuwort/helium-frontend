export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if(
        auth.session.tfa_enabled &&
        !auth.session.tfa_verified &&
        to.path !== auth.routes.verify2FA
    ){
        return navigateTo(auth.routes.verify2FA, { replace: true })
    }
})
