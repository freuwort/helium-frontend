type Id = string | number

type Item = {
    id: Id,
    [key: string]: any,
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
    }
}

export default class ItemPageManager
{
    items = ref<Item[]>([])
    itemIds = ref<(string | number)[]>([])
    selection = ref<(string | number)[]>([])
    processing = ref<boolean>(false)
    scope = ref<string | null>(null)
    filter = ref({})
    sort = ref<Sort>({
        field: null,
        order: 'desc',
    })
    pagination = ref<Pagination>({
        page: 1,
        size: 20,
        total: 0,
    })
    options = ref<IPMOptions>({
        pageTitle: 'Items',
        routes: {
            fetch: null,
            store: null,
            editor: null,
            duplicate: null,
            delete: null,
        },
        view: {
            layout: 'list',
            showPreview: false,
        }
    })

    constructor(options: IPMOptions = {})
    {
        this.items.value = []
        this.itemIds.value = []
        this.selection.value = []
        this.processing.value = false
        this.scope.value = options.scope ?? null
        // this.filter.value = LocalSetting.get(this.scope, 'filter', {})
        this.filter.value = {}
        this.sort.value = {
            // field: LocalSetting.get(this.scope, 'sort.field', null),
            // order: LocalSetting.get(this.scope, 'sort.order', 'desc'),
            field: null,
            order: 'desc',
        }
        this.pagination.value = {
            // page: LocalSetting.get(this.scope, 'pagination.page', 1),
            // size: LocalSetting.get(this.scope, 'pagination.size', 20),
            page: 1,
            size: 20,
            total: 0,
        }
        this.options.value = {
            pageTitle: options?.pageTitle ?? 'Items',
            routes: {
                fetch: options?.routes?.fetch ?? null,
                store: options?.routes?.store ?? null,
                editor: options?.routes?.editor ?? null,
                duplicate: options?.routes?.duplicate ?? null,
                delete: options?.routes?.delete ?? null,
            },
            view: {
                layout: options?.view?.layout ?? 'list',
                showPreview: options?.view?.showPreview ?? false,
            }
        }

        return this
    }



    get tableScope()
    {
        return this.scope + '.table'
    }



    get modelFilter()
    {
        return this.filter
    }

    set modelFilter(value)
    {
        this.filter = value

        this.throttledFetch()

        // LocalSetting.set(this.scope, 'filter', this.filter)
    }



    get modelSort()
    {
        return this.sort
    }

    set modelSort(value)
    {
        this.sort = {
            ...this.sort,
            ...value,
        }

        this.throttledFetch()

        // LocalSetting.set(this.scope, 'sort.field', this.sort.field)
        // LocalSetting.set(this.scope, 'sort.order', this.sort.order)
    }



    get modelPagination()
    {
        return this.pagination
    }

    set modelPagination(value)
    {
        this.pagination = {
            ...this.pagination,
            ...value,
        }

        this.throttledFetch()

        // LocalSetting.set(this.scope, 'pagination.page', this.pagination.page)
        // LocalSetting.set(this.scope, 'pagination.size', this.pagination.size)
    }



    async fetch()
    {
        this.processing.value = true

        try
        {
            let { data, error } = await useApiFetch(makePath(this.options.value.routes?.fetch as string, {
                ...this.filter.value,
                ...{sort: this.sort.value},
                ...this.pagination.value
            }))



            this.items.value = data?.value?.data ?? []
            this.itemIds = data?.value?.item_ids ?? this.items.value.map(i => i?.id).filter(id => id || id === 0 || id === '0') ?? []
            this.pagination.value.total = data?.value?.total ?? 0
        }
        catch (error)
        {
            console.error(error)
        }
        
        this.processing.value = false
    }

    throttledFetch = _.throttle(this.fetch, 300)



    toggleSelection(item: Item): void
    {
        if (this.selection.value.includes(item.id))
        {
            this.selection.value = this.selection.value.filter(p => p !== item.id)
        }
        else
        {
            this.selection.value.push(item.id)
        }
    }

    setSelection(item: Item)
    {
        this.selection.value = [item.id]
    }

    addSelection(item: Item)
    {
        if (this.selection.value.includes(item.id)) return

        this.selection.value.push(item.id)
    }

    selectAll()
    {
        this.selection.value = this.items.value.map(i => i.id)
    }

    deselectAll()
    {
        this.selection.value = []
    }



    open(id: Id | null = null)
    {
        if (!id) return navigateTo(this.options.value.routes?.editor)

        navigateTo(this.options.value.routes?.editor + '/' + id)
    }



    store(data: any[])
    {
        useForm(data).post(this.options.value.routes?.store as string, {
            onSuccess: () => {
                this.fetch()
            },
        })
    }



    duplicate(id: Id)
    {
        useForm({returnTo: 'current'}).post(this.options.value.routes?.duplicate + '/' + id, {
            onSuccess: () => {
                this.fetch()
            },
        })
    }



    delete(ids: Id[] = [], message = 'Are you sure you want to delete the selected items?', options = {})
    {
        // Construct options
        options = {
            replacement: options?.replacement ?? null,
            needsConfirmation: options?.needsConfirmation ?? true,
            message: replaceVariable(message ?? options?.message),
        }

        // Construct data
        let data = {
            ids: ids ?? this.selection.value ?? [],
            replacement: options.replacement,
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
        useForm(data).delete(this.options.value.routes?.delete, {
            onSuccess: () => {
                this.deselectAll()
                this.fetch()
            },
        })



        function replaceVariable(string: string)
        {
            return string.replace('{{count}}', ids.length)
        }
    }
}