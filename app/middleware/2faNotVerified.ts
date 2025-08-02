export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
    const authHome = auth.routes.authHome
    const intendedQuery = to.query?.intended ? `?intended=${to.query.intended}` : ''

    function destinationDiffersFrom(route: string) {
        return to.path !== route
    }

    if (destinationDiffersFrom(authHome) && (!auth.session.tfa_enabled || (auth.session.tfa_enabled && auth.session.tfa_verified))) {
        return navigateTo(authHome+intendedQuery, { replace: true })
    }
})
