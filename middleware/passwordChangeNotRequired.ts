export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        auth.user?.requires_password_change &&
        to.path !== auth.routes.passwordChangeRequiredHome
    ){
        return navigateTo(auth.routes.passwordChangeRequiredHome+redirectQuery.value, { replace: true })
    }
})
