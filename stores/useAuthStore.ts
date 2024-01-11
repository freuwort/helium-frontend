type User = {
    id: number

    profile_image: string
    email: string | null
    username: string | null
    ident_number: string | null

    name: string | null
    prefix: string | null
    firstname: string | null
    middlename: string | null
    lastname: string | null
    suffix: string | null
    nickname: string | null
    legalname: string | null

    company: string | null
    department: string | null
    title: string | null

    email_verified_at: string | null
    enabled_at: string | null
    deleted_at: string | null
    created_at: string | null
    updated_at: string | null

    settings: {
        language?: string
        timezone?: string
        theme?: string
        two_factor_auth_enabled?: boolean
    }

    roles: string[]
    permissions: string[]
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