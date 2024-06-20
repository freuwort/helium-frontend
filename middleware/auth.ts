export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        !auth.session.authenticated &&
        to.path !== auth.routes.login
    ){
        return navigateTo(auth.routes.login+redirectQuery.value, { replace: true })
    }
})
