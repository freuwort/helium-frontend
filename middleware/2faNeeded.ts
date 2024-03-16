export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if(
        (!auth.session.tfa_enabled || (auth.session.tfa_enabled && auth.session.tfa_verified)) &&
        to.path !== auth.routes.authHome
    ){
        return navigateTo(auth.routes.authHome, { replace: true })
    }
})
