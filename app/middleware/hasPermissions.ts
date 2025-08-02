import PermissionConfig from '~~/config/permission'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
    
    let destination = to.name as string
    let permissions = [] as string[]
    let redirect = '' as string
    
    for (const [key, value] of Object.entries(PermissionConfig)) {
        const routeWildcard = new RegExp(`^${key}$`)
    
        if (routeWildcard.test(destination)) {
            permissions = value?.permissions ?? []
            redirect = value?.redirect ?? ''
        }
    }

    redirect = routeReplaceTemplates(redirect)

    if (permissions.length && !auth.can(permissions)) {
        if (routeIsValid(redirect)) {
            return navigateTo(redirect, { external: routeIsExternal(redirect) })
        }

        return navigateTo(auth.routes.profile)
    }
})
