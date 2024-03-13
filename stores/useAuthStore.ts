type User = {
    id: number

    profile_image: string
    email: string | null
    username: string | null
    ident_number: string | null

    has_two_factor_enabled: boolean
    has_tfa_totp_enabled: boolean
    has_tfa_sms_enabled: boolean
    default_two_factor_method: string | null

    salutation: string | null
    fullname: string | null
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

type UserApiResponse = {
    data: {
        value?: {
            data: User
        }
    }
    error: {
        value?: {
            message: string
        }
    }
}



export const useAuthStore = defineStore('auth', () => {

    const splashscreen = useSplashscreenStore()

    const user = ref<User | null>(null)
    const options = ref({
        routes: {
            authHome: '/d',
            guestHome: '/login',
            register: '/register',
            login: '/login',
            forgotPassword: '/forgot-password',
            verify2FA: '/verify-2fa',
        },
        apiRoutes: {
            user: '/api/user',
            register: '/register',
            login: '/login',
            forgotPassword: '/forgot-password',
            verify2FA: '/verify-2fa',
            logout: '/logout',
        }
    })

    const authenticated = computed(() => {
        if (user.value === undefined) return false
        if (user.value === null) return false
        return true
    })

    const status = computed(() => {
        return {
            authenticated: authenticated.value,
            user: user.value,
        }
    })

    const routes = computed(() => options.value.routes)
    const apiRoutes = computed(() => options.value.apiRoutes)



    async function fetchUser()
    {
        const response = await useApiFetch(apiRoutes.value.user) as UserApiResponse

        if (response.error.value)
        {
            user.value = null
            return
        }

        user.value = response.data.value?.data || null
    }



    async function logout()
    {
        splashscreen.start()

        await useApiFetch(apiRoutes.value.logout, { method: 'POST' })

        user.value = null

        navigateTo(routes.value.guestHome)
    }



    return {
        user,
        authenticated,
        routes,
        apiRoutes,
        fetchUser,
        logout,
    }
})