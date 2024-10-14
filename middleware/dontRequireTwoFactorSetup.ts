export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        auth.user?.requires_two_factor &&
        !auth.user?.has_tfa_enabled &&
        to.path !== auth.routes.requireTwoFactorSetupHome
    ){
        return navigateTo(auth.routes.requireTwoFactorSetupHome+redirectQuery.value, { replace: true })
    }
})
