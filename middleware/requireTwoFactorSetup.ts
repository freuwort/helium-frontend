export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)

    if(
        (!auth.user?.requires_two_factor || auth.user?.has_tfa_enabled) &&
        to.path !== auth.routes.authHome
    ){
        return navigateTo(redirect.value ?? auth.routes.authHome, {
            replace: true,
            external: !!redirect.value,
        })
    }
})
