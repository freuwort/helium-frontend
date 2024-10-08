export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    const redirect = computed(() => to.query.redirect as string ?? null)
    const redirectQuery = computed(() => redirect.value ? `?redirect=${redirect.value}` : '')

    if(
        auth.user?.enabled_at === null &&
        to.path !== auth.routes.disabledHome
    ){
        return navigateTo(auth.routes.disabledHome+redirectQuery.value, { replace: true })
    }
})
