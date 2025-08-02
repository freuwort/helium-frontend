export default defineNuxtRouteMiddleware((to, from) => {
    const intendedParam = to.query?.intended as string ?? null

    if (intendedParam && to.fullPath !== intendedParam) {
        let destination = intendedParam ?? ''

        if (!destination.startsWith('http') && !destination.startsWith('/')) {
            destination = `/${destination}`
        }
        
        return navigateTo(destination, {
            replace: true,
            external: destination.startsWith('http')
        })
    }
})
