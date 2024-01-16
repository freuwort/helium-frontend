import type { NuxtError } from "nuxt/app"

type SubmitOptions = {
    method?: 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete',
    forceFormData?: boolean,
    onSuccess?: Function,
    onError?: Function,
}

type Form = {
    [key: string]: any,
    errors: NuxtError[],
    processing: boolean,
    submit: Function,
    get: Function,
    post: Function,
    put: Function,
    patch: Function,
    delete: Function,
    reset: Function,
    data: Function,
}



export function useForm(fields: Object): Form
{
    return reactive({
        ...fields,
        errors: [] as NuxtError[],
        processing: false as boolean,

        async submit(path: string, options: SubmitOptions = {})
        {
            // Set the form as processing
            this.processing = true
    
            // Build the form request
            const request = {
                method: options.method || 'get',
                body: null as any,
            }
    
            // Build the form data
            if (!['get', 'head'].includes(request.method))
            {
                request.body = this
    
                // Force form data
                if (options.forceFormData)
                {
                    const formData = new FormData()
    
                    for (const key in this)
                    {
                        // formData.append(key, form[key])
                    }
    
                    request.body = formData
                }
            }
    
            // Send the request
            const { data, error } = await useApiFetch(path, request)
    
            // Reset the errors
            this.clearErrors()
    
            // Handle errors
            if (error.value)
            {
                let nuxtError = createError(error.value)
                // Set the form errors
                this.errors = [nuxtError]
    
                // Put error in session store
                useSessionErrorStore().addError(nuxtError)
    
                // Call the error callback
                if (options.onError) options.onError(nuxtError)
            }
            // Handle success
            else
            {
                // Call the success callback
                if (options.onSuccess) options.onSuccess(data)
            }
        
            // Set the form as not processing
            this.processing = false
    
            // Return form
            return this
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

        reset()
        {
            return this
        },

        data()
        {
            return this
        },
        
        clearErrors()
        {
            this.errors = []
        }
    })
}