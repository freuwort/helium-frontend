type User = {
    id: number

    profile_image: string
    email: string | null
    username: string | null
    ident_number: string | null

    has_tfa_enabled: boolean
    has_tfa_totp_method_enabled: boolean
    has_tfa_sms_method_enabled: boolean
    has_tfa_email_method_enabled: boolean
    default_tfa_method: string | null

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

    const session = ref({
        authenticated: false,
        twoFactorVerified: false,
    })
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
            session: '/api/session',
            register: '/register',
            login: '/login',
            forgotPassword: '/forgot-password',
            verify2FA: '/verify-2fa',
            logout: '/logout',
        }
    })

    const routes = computed(() => options.value.routes)
    const apiRoutes = computed(() => options.value.apiRoutes)



    async function fetchSession()
    {
        const sessionResponse = await useApiFetch(apiRoutes.value.session)
        // const userResponse = await useApiFetch(apiRoutes.value.user) as UserApiResponse
        
        // if (userResponse.error.value || sessionResponse.error.value)
        // {
        //     user.value = null
        //     session.value.authenticated = false
        //     session.value.twoFactorVerified = false
        //     return
        // }
    
        // user.value = userResponse.data.value?.data || null
        session.value.authenticated = sessionResponse.data.value?.authenticated || false
        session.value.twoFactorVerified = sessionResponse.data.value?.two_factor_verified || false

        console.log(sessionResponse.data.value)
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
        session,
        routes,
        apiRoutes,
        fetchSession,
        logout,
    }
})