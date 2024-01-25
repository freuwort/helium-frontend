import _ from 'lodash'

type Id = string | number

type Item = {
    id: Id,
    [key: string]: any,
}

type FetchData = {
    items?: Item[],
    item_ids?: Id[],
    total?: number,
}

type Sort = {
    field: string | null,
    order: string,
}

type Pagination = {
    page: number,
    size: number,
    total: number,
}

type IPMOptions = {
    pageTitle?: string,
    scope?: string,
    routes?: {
        fetch?: string | null,
        store?: string | null,
        editor?: string | null,
        duplicate?: string | null,
        delete?: string | null,
    },
    view?: {
        layout?: string,
        showPreview?: boolean,
    },
    fetchImmediately?: boolean,
}

type DeleteOptions = {
    needsConfirmation?: boolean,
    message?: string,
}



export function useItemPageManager(options: Partial<IPMOptions> = {})
{
    const LocalStorage = useBrowserStorage('local')
    const SessionStorage = useBrowserStorage('session')

    const IPM = reactive({
        items: [] as Item[],
        itemIds: [] as Id[],
        selection: [] as Id[],
        processing: false as boolean,
        scope: '' as string,
        filter: {},
        sort: {
            field: null,
            order: 'desc',
        } as Sort,
        pagination: {
            page: 1,
            size: 20,
            total: 0,
        } as Pagination,
        options: {
            pageTitle: options?.pageTitle ?? 'Items',
            routes: {
                fetch: options?.routes?.fetch ?? null,
                store: options?.routes?.store ?? null,
                editor: options?.routes?.editor ?? null,
                duplicate: options?.routes?.duplicate ?? null,
                delete: options?.routes?.delete ?? null,
            },
            view: {
                layout: 'list',
                showPreview: false,
            },
            fetchImmediately: options?.fetchImmediately ?? true,
        } as IPMOptions,

        get tableScope()
        {
            return this.scope + '.table'
        },

        get modelFilter()
        {
            return this.filter
        },

        set modelFilter(value)
        {
            this.filter = value

            this.throttledFetch()

            SessionStorage.set(this.scope, 'filter', this.filter)
        },



        get modelSort()
        {
            return this.sort
        },

        set modelSort(value)
        {
            this.sort = {
                ...this.sort,
                ...value,
            }

            this.throttledFetch()

            SessionStorage.set(this.scope, 'sort.field', this.sort.field)
            SessionStorage.set(this.scope, 'sort.order', this.sort.order)
        },



        get modelPagination()
        {
            return this.pagination
        },

        set modelPagination(value)
        {
            this.pagination = {
                ...this.pagination,
                ...value,
            }

            this.throttledFetch()

            SessionStorage.set(this.scope, 'pagination.page', this.pagination.page)
            SessionStorage.set(this.scope, 'pagination.size', this.pagination.size)
        },



        fetch: $fetch,
        throttledFetch: _.throttle($fetch, 300),



        toggleSelection(item: Item): void
        {
            if (this.selection.includes(item.id))
            {
                this.selection = this.selection.filter(p => p !== item.id)
            }
            else
            {
                this.selection.push(item.id)
            }
        },

        setSelection(item: Item)
        {
            this.selection = [item.id]
        },

        addSelection(item: Item)
        {
            if (this.selection.includes(item.id)) return

            this.selection.push(item.id)
        },

        selectAll()
        {
            this.selection = this.items.map(i => i.id)
        },

        deselectAll()
        {
            this.selection = []
        },



        open(id?: Id)
        {
            navigateTo(apiRoute(this.options.routes?.editor as string, { id: id ?? '' }))
        },

        store(data: any[])
        {
            useForm(data).post(this.options.routes?.store as string, {
                onSuccess: () => {
                    $fetch()
                },
            })
        },

        duplicate(id: Id)
        {
            useForm({}).post(apiRoute(this.options.routes?.duplicate as string, { id }), {
                onSuccess: () => {
                    $fetch()
                },
            })
        },

        delete(ids: Id[] = [], message: string = 'Are you sure you want to delete the selected items?', options: DeleteOptions = {})
        {
            // Construct options
            options = {
                needsConfirmation: options?.needsConfirmation ?? true,
                message: replaceVariable(message ?? options?.message),
            }

            // Construct data
            let data = {
                ids: ids ?? this.selection ?? [],
            }



            // If ids is not an array, convert it to an array and remove any empty values
            if (typeof data.ids !== 'object') data.ids = [data.ids].filter(id => id)

            // If ids is empty, return
            if (!data.ids.length) return

            // If request needs confirmation, ask the user to confirm
            if (options.needsConfirmation)
            {
                // If the user cancels the delete, return
                if (!confirm(options.message)) return
            }

            // Delete the items
            useForm(data).delete(apiRoute(this.options.routes?.delete as string), {
                onSuccess: () => {
                    this.deselectAll()
                    $fetch()
                },
            })



            function replaceVariable(string: string)
            {
                return string.replace('{{count}}', ids.length.toString())
            }
        },
    })



    async function $fetch()
    {
        IPM.processing = true

        let route = apiRoute(IPM.options.routes?.fetch as string, {
            filter: IPM.filter,
            sort: IPM.sort,
            pagination: IPM.pagination,
        })

        let { data, error } = await useApiFetch(route)

        let fetchData = data?.value as FetchData

        IPM.items = fetchData.items ?? []
        IPM.itemIds = fetchData.item_ids ?? IPM.items.map(i => i?.id).filter(id => id || id === 0 || id === '0') ?? []
        IPM.pagination.total = fetchData.total ?? 0

        IPM.processing = false
    }



    // ToDo: there surely is a better way to do this
    IPM.filter = SessionStorage.get(IPM.scope, 'filter', {})
    IPM.sort.field = SessionStorage.get(IPM.scope, 'sort.field', null)
    IPM.sort.order = SessionStorage.get(IPM.scope, 'sort.order', 'desc')
    IPM.pagination.page = SessionStorage.get(IPM.scope, 'pagination.page', 1)
    IPM.pagination.size = SessionStorage.get(IPM.scope, 'pagination.size', 20)



    // Fetch immediately if needed
    if (IPM.options.fetchImmediately) $fetch()



    // Return the IPM
    return IPM
}