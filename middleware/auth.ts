export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    if(
        !auth.session.authenticated &&
        to.path !== auth.routes.login
    ){
        return navigateTo(auth.routes.login, { replace: true })
    }
})
