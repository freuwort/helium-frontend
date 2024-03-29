export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if(
        auth.session.authenticated &&
        to.path !== auth.routes.authHome
    ){
        return navigateTo(auth.routes.authHome, { replace: true })
    }
})
