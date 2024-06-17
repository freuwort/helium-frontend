type User = {
    id: number

    profile_image: string
    profile_banner: string | null
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

type SessionInfo = {
    authenticated: boolean
    tfa_enabled: boolean
    tfa_verified: boolean
}

type ApiError = {
    value?: {
        message: string
    }
}

type UserApiResponse = {
    data: {
        value: {
            data: User
        }
    }
    error: ApiError
}

type SessionApiResponse = {
    data: {
        value: {
            user: User
            session: SessionInfo
        }
    }
    error: ApiError
}



export const useAuthStore = defineStore('auth', () => {

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
            verifyTfaTotp: '/verify-tfa-totp',
            verifyTfaSms: '/verify-tfa-sms',
            verifyTfaEmail: '/verify-tfa-email',
            verifyTfaBackup: '/verify-tfa-backup',
            logout: '/logout',
        }
    })
    const routes = computed(() => options.value.routes)
    const apiRoutes = computed(() => options.value.apiRoutes)
    const splashscreen = useSplashscreenStore()


    const user = ref<User | null>(null)
    const session = ref({
        authenticated: false,
        tfa_enabled: false,
        tfa_verified: false,
    })



    async function fetchUser()
    {
        const response = await useApiFetch(apiRoutes.value.user) as UserApiResponse

        if (response.error.value) return

        user.value = response.data.value.data
    }

    async function fetchSession()
    {
        const response = await useApiFetch(apiRoutes.value.session) as SessionApiResponse
        
        if (response.error.value) return
    
        user.value = response.data.value.user
        session.value = response.data.value.session
    }



    async function logout()
    {
        splashscreen.start()

        await useApiFetch(apiRoutes.value.logout, { method: 'POST' })

        user.value = null
        session.value.authenticated = false
        session.value.tfa_enabled = false
        session.value.tfa_verified = false

        navigateTo(routes.value.guestHome)
    }



    return {
        user: user as unknown as User | null,
        session: session as unknown as SessionInfo,
        routes: routes as unknown as Record<string, string>,
        apiRoutes: apiRoutes as unknown as Record<string, string>,
        fetchUser,
        fetchSession,
        logout,
    }
})