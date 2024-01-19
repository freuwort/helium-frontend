import _ from 'lodash'
import type { NuxtError } from "nuxt/app"



type SubmitOptions = {
    method?: 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete',
    forceFormData?: boolean,
    onSuccess?: Function,
    onError?: Function,
}

type FormDataType = object

interface Form extends FormDataType
{
    [key: string]: any,
    errors: NuxtError[],
    processing: boolean,
    data(): Partial<Object>,
    defaults(data: Object): void,
    transform(callback: (data: any) => any): Form,
    reset(): void,
    submit(path: string, options?: SubmitOptions | Object): Promise<void>,
    get(path: string, options?: SubmitOptions | Object): Promise<void>,
    post(path: string, options?: SubmitOptions | Object): Promise<void>,
    put(path: string, options?: SubmitOptions | Object): Promise<void>,
    patch(path: string, options?: SubmitOptions | Object): Promise<void>,
    delete(path: string, options?: SubmitOptions | Object): Promise<void>,
}



export function useForm(fields: Object): Form
{
    const $reserved = [
        'errors',
        'processing',
        'data',
        'defaults',
        'reset',
        'transform',
        'clearErrors',
        'submit',
        'get',
        'post',
        'put',
        'patch',
        'delete',
    ]

    let $withoutReserved = (data: any = null): Partial<Object> => {
        return _.omit(data, $reserved)
    }

    let $transform = (data: any) => data
    let $defaults = $withoutReserved(fields)



    const form = reactive({
        // Data
        ...$withoutReserved(fields),

        // Read-only data
        errors: [] as NuxtError[],
        processing: false as boolean,
        
        // Methods
        data()
        {
            return $withoutReserved(this)
        },

        defaults(data: Object)
        {
            $defaults = Object.assign($defaults, $withoutReserved(data))
        },

        reset() {
            Object.assign(form, $defaults)
        },

        transform(callback: (data: any) => any)
        {
            $transform = callback

            return this
        },

        clearErrors() {
            this.errors = []
        },

        async submit(path: string, options: SubmitOptions = {}): Promise<void>
        {
            this.processing = true
            this.clearErrors()

            const transformedData = $transform(this.data())

            const request = {
                method: options.method || 'get',
                body: transformedData,
            }
        
            // Convert the body to FormData if needed
            if (options.forceFormData)
            {
                const formData = new FormData()

                for (const key in transformedData)
                {
                    formData.append(key, transformedData[key])
                }

                request.body = formData
            }

            // Remove the body if not needed
            if (['get', 'head'].includes(request.method)) request.body = null
    
            const { data, error } = await useApiFetch(path, request)
    
            // Handle errors
            if (error.value)
            {
                let nuxtError = createError(error.value)

                this.errors = [nuxtError]
    
                if (options.onError) options.onError(nuxtError)
            }
            // Handle success
            else
            {
                if (options.onSuccess) options.onSuccess(data)
            }
        
            // Set the form as not processing
            this.processing = false
        },

        get(path: string, options: SubmitOptions = {})
        {
            return this.submit(path, { ...options, method: 'get' })
        },
    
        post(path: string, options: SubmitOptions = {})
        {
            return this.submit(path, { ...options, method: 'post' })
        },
    
        put(path: string, options: SubmitOptions = {})
        {
            return this.submit(path, { ...options, method: 'put' })
        },
    
        patch(path: string, options: SubmitOptions = {})
        {
            return this.submit(path, { ...options, method: 'patch' })
        },
    
        delete(path: string, options: SubmitOptions = {})
        {
            return this.submit(path, { ...options, method: 'delete' })
        },
    })

    return form
}