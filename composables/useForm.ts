type SubmitOptions = {
    method?: 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete',
    forceFormData?: boolean,
    onSuccess?: Function,
    onError?: Function,
}

type Form = {
    [key: string]: any,
    validationErrors: Object,
    processing: boolean,
    submit: Function,
    get: Function,
    post: Function,
    put: Function,
    patch: Function,
    delete: Function,
}



export function useForm(fields: Object): Form
{
    // Create the form
    const form = reactive({
        ...fields,
        validationErrors: {},
        processing: false,
        submit,
        get,
        post,
        put,
        patch,
        delete: destroy,
    })

    // Return the form
    return form



    async function submit(path: string, options: SubmitOptions = {})
    {
        // Set the form as processing
        form.processing = true

        // Build the form request
        const request = {
            method: options.method || 'get',
            body: null as any,
        }

        // Build the form data
        if (!['get', 'head'].includes(request.method))
        {
            request.body = form

            // Force form data
            if (options.forceFormData)
            {
                const formData = new FormData()

                for (const key in form)
                {
                    // formData.append(key, form[key])
                }

                request.body = formData
            }
        }

        // Send the request
        const { data, error } = await useApiFetch(path, request)

        // Reset the validation errors
        clearValidationErrors()

        // Handle errors
        if (error.value)
        {
            // Handle validation errors
            if (error.value.statusCode == 422)
            {
                // Set the form errors
                form.validationErrors = error.value.data.errors
            }

            // Put error in store
            useErrorStore().addError({
                message: error.value.message,
                data: error.value.data,
            })

            // Call the error callback
            if (options.onError) options.onError(error.value)
        }
        // Handle success
        else
        {
            // Call the success callback
            if (options.onSuccess) options.onSuccess(data)
        }
    
        // Set the form as not processing
        form.processing = false

        // Return form
        return form
    }



    function get(path: string, options: SubmitOptions = {})
    {
        return submit(path, { ...options, method: 'get' })
    }

    function post(path: string, options: SubmitOptions = {})
    {
        return submit(path, { ...options, method: 'post' })
    }

    function put(path: string, options: SubmitOptions = {})
    {
        return submit(path, { ...options, method: 'put' })
    }

    function patch(path: string, options: SubmitOptions = {})
    {
        return submit(path, { ...options, method: 'patch' })
    }

    function destroy(path: string, options: SubmitOptions = {})
    {
        return submit(path, { ...options, method: 'delete' })
    }



    function clearValidationErrors()
    {
        form.validationErrors = {}
    }
}