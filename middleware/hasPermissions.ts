import PermissionConfig from '~/permission.config'

export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
    const runtimeConfig = useRuntimeConfig()
    
    let permissions = [] as string[]
    let returnTo = null as string | null
    
    for (const [key, value] of Object.entries(PermissionConfig)) {
        const regex = new RegExp(`^${key}$`)
    
        if (!regex.test(to.name as string)) continue
        
        permissions = value?.permissions ?? []
        returnTo = value?.alternativeRedirect ?? null
    }

    if (returnTo === 'WEBSITE') returnTo = runtimeConfig.public.websiteUrl
    if (returnTo === 'ADMIN') returnTo = runtimeConfig.public.frontendUrl
    if (!isPathOrUrl(returnTo)) returnTo = null

    if (!auth.can(Array.from(permissions))) {
        return returnTo ?
            navigateTo(returnTo, { replace: true, external: true }) :
            abortNavigation({ statusCode: 403, message: 'Forbidden' })
    }
})
