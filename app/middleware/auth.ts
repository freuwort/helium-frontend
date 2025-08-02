export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
    const { login, emailNotVerifiedHome, verify2FA, notEnabledHome, blockedHome, requirePasswordChangeHome, requireTwoFactorSetupHome} = auth.routes
    const intendedQuery = to.query?.intended ? `?intended=${to.query.intended}` : ''

    function destinationDiffersFrom(route: string) {
        return to.path !== route
    }



    // Not logged in
    if (!auth.session.authenticated) {
        if (destinationDiffersFrom(login)) return navigateTo(login+intendedQuery)
    }

    // Email not verified
    else if (auth.user?.email_verified_at === null) {
        if (destinationDiffersFrom(emailNotVerifiedHome)) return navigateTo(emailNotVerifiedHome+intendedQuery)
    }

    // 2FA not verified
    else if (auth.session.tfa_enabled && !auth.session.tfa_verified) {
        if (destinationDiffersFrom(verify2FA)) return navigateTo(verify2FA+intendedQuery)
    }

    // Not enabled
    else if (auth.user?.enabled_at === null) {
        if (destinationDiffersFrom(notEnabledHome)) return navigateTo(notEnabledHome+intendedQuery)
    }

    // Blocked
    else if (auth.user?.blocked_at !== null) {
        if (destinationDiffersFrom(blockedHome)) return navigateTo(blockedHome+intendedQuery)
    }

    // Requires password change
    else if (auth.user?.requires_password_change) {
        if (destinationDiffersFrom(requirePasswordChangeHome)) return navigateTo(requirePasswordChangeHome+intendedQuery)
    }

    // Requires 2FA setup
    else if (auth.user?.requires_two_factor && !auth.user?.has_tfa_enabled) {
        if (destinationDiffersFrom(requireTwoFactorSetupHome)) return navigateTo(requireTwoFactorSetupHome+intendedQuery)
    }
})
