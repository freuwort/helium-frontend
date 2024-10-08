export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        auth.user?.email_verified_at === null &&
        to.path !== auth.routes.emailUnverifiedHome
    ){
        return navigateTo(auth.routes.emailUnverifiedHome+redirectQuery.value, { replace: true })
    }
})
