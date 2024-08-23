type User = {
    id: number

    avatar: string
    banner: string | null
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
        [key: string]: any
    }

    roles: string[]
    permissions: string[]
}

type SessionInfo = {
    authenticated: boolean
    tfa_enabled: boolean
    tfa_verified: boolean
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



    async function fetchSession()
    {
        try {
            const { data } = await useAxios().get(apiRoutes.value.session)

            user.value = data.user
            session.value = data.session
        }
        catch (error) {
            console.log('Could not fetch session!')
        }
    }



    async function logout(redirect?: string)
    {
        splashscreen.start()

        await useAxios().post(apiRoutes.value.logout)

        user.value = null
        session.value.authenticated = false
        session.value.tfa_enabled = false
        session.value.tfa_verified = false

        return navigateTo(redirect ?? routes.value.guestHome, {
            replace: true,
            external: !!redirect
        })
    }



    function getSettings(key: string, defaultValue: any = null, storage: 'session'|'local'|'db' = 'db')
    {
        if (storage === 'session') return useBrowserStorage('session').get(key, defaultValue)
        if (storage === 'local') return useBrowserStorage('local').get(key, defaultValue)
        if (storage === 'db') {
            return user.value?.settings[key] ?? defaultValue
        }
    }

    async function setSettings(key: string, value: any, storage: 'session'|'local'|'db' = 'db')
    {
        if (storage === 'session') useBrowserStorage('session').set(key, value)
        if (storage === 'local') useBrowserStorage('local').set(key, value)
        if (storage === 'db') {
            if (user.value?.settings) user.value.settings[key] = value
            await useAxios().patch('/api/user/settings/'+key, { value })
        }
    }



    return {
        user: user as unknown as User | null,
        session: session as unknown as SessionInfo,
        routes: routes as unknown as Record<string, string>,
        apiRoutes: apiRoutes as unknown as Record<string, string>,
        fetchSession,
        logout,

        getSettings,
        setSettings,
    }
})