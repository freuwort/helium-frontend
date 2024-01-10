type User = {
    id: number
    profile_image: string
    name: string | null
    email: string | null
    username: string | null
    ident_number: string | null
    email_verified_at: string | null
    enabled_at: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null
    roles: string[]
    permissions: string[]
    settings: {
        language?: string
        timezone?: string
        theme?: string
    }
}

type RegistrationInfo = {
    firstname: string
    lastname: string
    email: string
    password: string
}

type Credentials = {
    email: string
    password: string
    remember: boolean
}

export const useAuthStore = defineStore('auth', () => {

    const user = ref<User | null>(null)
    const isLoggedIn = computed(() => user.value !== null)



    async function register(info: RegistrationInfo)
    {
        await useApiFetch('/sanctum/csrf-cookie')

        const request = await useApiFetch('/register', {
            method: 'POST',
            body: info,
        })

        await fetchUser()

        return request
    }



    async function login(credentials: Credentials)
    {
        await useApiFetch('/sanctum/csrf-cookie')

        const request = await useApiFetch('/login', {
            method: 'POST',
            body: credentials,
        })

        await fetchUser()

        return request
    }



    async function fetchUser()
    {
        const { data } = await useApiFetch('/api/user')

        user.value = data.value as User
    }



    async function logout()
    {
        await useApiFetch('/logout', { method: 'POST' })

        user.value = null

        navigateTo('/login')
    }



    return { user, isLoggedIn, register, login, fetchUser, logout }
})