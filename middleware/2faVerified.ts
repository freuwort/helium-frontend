export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        auth.session.tfa_enabled &&
        !auth.session.tfa_verified &&
        to.path !== auth.routes.verify2FA
    ){
        return navigateTo(auth.routes.verify2FA+redirectQuery.value, { replace: true })
    }
})
