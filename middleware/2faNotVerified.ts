export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)

    if(
        (!auth.session.tfa_enabled || (auth.session.tfa_enabled && auth.session.tfa_verified)) &&
        to.path !== auth.routes.authHome
    ){
        return navigateTo(redirect.value ?? auth.routes.authHome, {
            replace: true,
            external: !!redirect.value,
        })
    }
})
