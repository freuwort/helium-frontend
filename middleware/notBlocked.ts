export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        auth.user?.blocked_at !== null &&
        to.path !== auth.routes.blockedHome
    ){
        return navigateTo(auth.routes.blockedHome+redirectQuery.value, { replace: true })
    }
})
