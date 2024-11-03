interface TableColumn
{
    name: string
    label: string
    valuePath: string
    sortable: boolean
    resizable: boolean
    hideable: boolean
    width: number
    default: any
    transform?: (value: any, item?: any) => any
}

export default class TableColumnBuilder
{
    private column: TableColumn

    constructor()
    {
        this.column = {
            name: '',
            label: '',
            valuePath: '',
            sortable: true,
            resizable: true,
            hideable: true,
            width: 200,
            default: '-',
        }
    }

    public reset(): TableColumnBuilder
    {
        this.column = {
            name: '',
            label: '',
            valuePath: '',
            sortable: true,
            resizable: true,
            hideable: true,
            width: 200,
            default: '-',
        }
        return this
    }

    public new(): TableColumnBuilder
    {
        this.reset()
        return this
    }

    public name(name: string, valuePath?: string): TableColumnBuilder
    {
        this.column.name = name
        this.column.valuePath = valuePath ?? name
        return this
    }

    public label(label: string): TableColumnBuilder
    {
        this.column.label = label
        return this
    }

    public valuePath(valuePath: string): TableColumnBuilder
    {
        this.column.valuePath = valuePath
        return this
    }

    public sortable(sortable: boolean = true): TableColumnBuilder
    {
        this.column.sortable = sortable
        return this
    }

    public resizable(resizable: boolean = true): TableColumnBuilder
    {
        this.column.resizable = resizable
        return this
    }

    public hideable(hideable: boolean = true): TableColumnBuilder
    {
        this.column.hideable = hideable
        return this
    }

    public width(width: number): TableColumnBuilder
    {
        this.column.width = width
        return this
    }

    public default(value: any): TableColumnBuilder
    {
        this.column.default = value
        return this
    }

    public transform(transform: ((value: any, item?: any) => any) | null): TableColumnBuilder
    {
        if (transform === null) delete this.column.transform
        else this.column.transform = transform
        return this
    }

    public build(): TableColumn
    {
        return this.column
    }
}