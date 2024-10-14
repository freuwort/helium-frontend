export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        auth.user?.email_verified_at === null &&
        to.path !== auth.routes.emailNotVerifiedHome
    ){
        return navigateTo(auth.routes.emailNotVerifiedHome+redirectQuery.value, { replace: true })
    }
})
