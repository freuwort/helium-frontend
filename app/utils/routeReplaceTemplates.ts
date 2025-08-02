export default function (route: string): string {
    const runtimeConfig = useRuntimeConfig()

    route = route.replaceAll('{{WEBSITE}}', runtimeConfig.public.websiteUrl)
    route = route.replaceAll('{{FRONTEND}}', runtimeConfig.public.frontendUrl)
    route = route.replaceAll('{{BACKEND}}', runtimeConfig.public.backendUrl)

    return route
}