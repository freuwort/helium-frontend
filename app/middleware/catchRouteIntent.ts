import middlewareConfig from '~/middleware.config'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
    const intendedParam = to.query?.intended as string ?? null
    const ignoreRoutes = [...Object.keys(middlewareConfig.mapping), auth.routes.authHome].filter(route => !['DEFAULT'].includes(route))

    if (
        !intendedParam &&                       // do not redirect if param is already set
        !ignoreRoutes.includes(from.path) &&    // do not redirect if from.path should be ignored (mostly the auth routes themselfs)
        from.fullPath !== to.fullPath           // do not redirect if both routes are the same
    ){
        return navigateTo(`${to.fullPath}?intended=${encodeURIComponent(from.fullPath)}`, { replace: true })
    }
})
