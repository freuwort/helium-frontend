type User = {
    id: number

    avatar: string
    banner: string | null
    email: string | null
    phone: string | null
    username: string | null

    has_tfa_enabled: boolean
    has_tfa_totp_method_enabled: boolean
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

    organisation: string | null
    department: string | null
    job_title: string | null

    customer_id: string | null
    employee_id: string | null
    member_id: string | null

    requires_password_change: boolean
    requires_two_factor: boolean

    email_verified_at: string | null
    phone_verified_at: string | null
    enabled_at: string | null
    blocked_at: string | null
    block_reason: string | null
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
            authHome: '/',
            guestHome: '/login',
            emailNotVerifiedHome: '/email-not-verified',
            notEnabledHome: '/not-enabled',
            blockedHome: '/blocked',
            requirePasswordChangeHome: '/change-password',
            requireTwoFactorSetupHome: '/setup-2fa',
            register: '/register',
            login: '/login',
            forgotPassword: '/forgot-password',
            verify2FA: '/verify-2fa',
        },
        apiRoutes: {
            session: '/api/session',
            register: '/register',
            login: '/login',
            changePassword: '/api/user/password',
            forgotPassword: '/forgot-password',
            resetPassword: '/reset-password',
            verifyTfaTotp: '/verify-tfa-totp',
            verifyTfaBackup: '/verify-tfa-backup',
            logout: '/logout',
        }
    })
    const routes = computed(() => options.value.routes)
    const apiRoutes = computed(() => options.value.apiRoutes)
    const splashscreen = useSplashscreenStore()
    const runtimeConfig = useRuntimeConfig()


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



    function hasAdminPermissions()
    {
        if (!user.value) return false

        return runtimeConfig.public.adminPermissions.some((permission) => user.value?.permissions.includes(permission))
    }

    function hasSuperAdminPermissions()
    {
        if (!user.value) return false

        return runtimeConfig.public.superAdminPermissions.some((permission) => user.value?.permissions.includes(permission))
    }

    function can(permissions: string|string[])
    {
        if (!user.value) return false

        // Convert string to array
        if (!Array.isArray(permissions)) permissions = [permissions]

        // Check for super user
        if (hasAdminPermissions()) return true

        return permissions.every((permission) => user.value?.permissions.includes(permission))
    }

    function canAny(permissions: string|string[])
    {
        if (!user.value) return false

        // Convert string to array
        if (!Array.isArray(permissions)) permissions = [permissions]

        // Check for admin
        if (hasAdminPermissions()) return true

        return permissions.some((permission) => user.value?.permissions.includes(permission))
    }



    return {
        // Auth
        user: user as unknown as User | null,
        session: session as unknown as SessionInfo,
        routes: routes as unknown as Record<string, string>,
        apiRoutes: apiRoutes as unknown as Record<string, string>,
        fetchSession,
        logout,

        // Settings
        getSettings,
        setSettings,

        // Permissions
        hasAdminPermissions,
        hasSuperAdminPermissions,
        can,
        canAny,
    }
})