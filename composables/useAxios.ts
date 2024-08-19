import axios from 'axios'

type Options = {
    headers?: any
    [key: string]: any
}



export function useAxios(options: Options = {})
{
    let headers: any = {
        accept: 'application/json',
    }

    // Get XSRF-TOKEN cookie
    const token = useCookie('XSRF-TOKEN')

    // Add XSRF-TOKEN header if it exists
    if (token.value) headers['X-XSRF-TOKEN'] = token.value as string

    // Add cookie header if on server
    if (process.server)
    {
        headers = {
            ...headers,
            ...useRequestHeaders(['cookie']),
            referer: 'http://localhost:3000',
        }
    }

    // Create axios instance
    return axios.create({
        baseURL: 'http://localhost:8000',
        withCredentials: true,
        headers: {
            ...headers,
            ...options.headers,
        },
        ...options,
    })
}