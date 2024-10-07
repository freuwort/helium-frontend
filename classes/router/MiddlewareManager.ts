import type { NuxtPage } from 'nuxt/schema'

export type MiddlewareMapping = {
    [key: string]: string[]
}



export class MiddlewareManager
{
    private mapping: MiddlewareMapping = {}
    private ignoredRoutes: string[] = []

    constructor ()
    {
        return this
    }

    public setIgnoredRoutes(routes: string[]): this
    {
        this.ignoredRoutes = routes
        return this
    }

    public addIgnoredRoute(route: string): this
    {
        this.ignoredRoutes.push(route)
        return this
    }

    public setMapping(mapping: MiddlewareMapping): this
    {
        this.mapping = mapping
        return this
    }

    public applyTo(pages: NuxtPage[]): void
    {
        for (const page of pages)
        {
            if (this.ignoredRoutes.includes(page.path)) continue

            page.meta ||= {}
            page.meta.middleware = this.mapping[page.path] ?? this.mapping['DEFAULT'] ?? []
            
            if (page.children) this.applyTo(page.children)
        }
    }
}