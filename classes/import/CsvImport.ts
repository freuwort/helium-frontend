import _ from 'lodash'

type Mapping = {
    [key: string]: string,
}

type DataRow = {
    [key: string]: any,
}



export class CsvImport
{
    public fields: Field[]|FieldGroup[] = []
    public mapping: Mapping = {}
    public hasHeader: boolean = true
    public delimiter: string = ';'
    private _data: string[][] = []
    private _raw: string|string[][] = ''

    constructor(fields: Field[]|FieldGroup[] = [])
    {
        this.fields = fields
    }


    get headers(): string[]
    {
        return (this.hasHeader ? this._data[0] : this._data[0].map((value, index) => index+1+'')) ?? []
    }

    get data(): DataRow[]
    {
        let data = this.hasHeader ? this._data.slice(1) : this._data
        
        return data.map(row => {
            return this.headers.reduce((obj: DataRow, header, index) => {
                obj[header] = row[index] ?? ''
                return obj
            }, {})
        })
    }

    get mappedFields(): Field[]
    {
        return this.getFields()
        .map((field: Field) => {
            field.header = this.getMapping(field.name)
            return field
        })
    }


    public getFields(): Field[]
    {
        return _.cloneDeep(this.fields)
        .map((field: Field|FieldGroup) => (field instanceof FieldGroup ? field.getFields() : field))
        .flat()
    }


    public setData(data: string|string[][])
    {
        this._data = typeof data === 'string' ? this.parse(data) : data
    }


    private parse(raw: string): string[][]
    {
        return raw
            .split('\n')
            .map(e => e.replaceAll('\r', ''))
            .filter(e => e.length > 0)
            .map(e => e.split(this.delimiter))
    }


    public getMapping(key: string): string
    {
        return this.mapping[key] ?? ''
    }

    public setMapping(key: string, value: string): void
    {
        this.mapping[key] = value
    }


    public applyMapping(): DataRow[]
    {
        return this.data.map((row: DataRow) => this.mappedFields.reduce((obj: DataRow, field: Field) => {
            obj[field.name] = row[field.header] ?? field.default
            return obj
        }, {}))
    }
}



export class FieldGroup
{
    public label: string
    public fields: Field[]

    constructor(label: string, fields: Field[])
    {
        this.label = label
        this.fields = fields
    }

    public getFields(): Field[]
    {
        return this.fields
    }
}



export class Field
{
    public name: string
    public label: string
    public default: any
    public header: string

    constructor(name: string, label: string, defaultValue: any = null)
    {
        this.name = name
        this.label = label
        this.default = defaultValue
        this.header = ''
    }
}