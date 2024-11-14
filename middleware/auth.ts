export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
    const { login, emailNotVerifiedHome, verify2FA, notEnabledHome, blockedHome, requirePasswordChangeHome, requireTwoFactorSetupHome} = auth.routes
    const intendedQuery = to.query?.intended ? `?intended=${to.query.intended}` : ''

    function destinationDiffersFrom(route: string) {
        return to.path !== route
    }



    // Not logged in
    if (destinationDiffersFrom(login) && !auth.session.authenticated) {
        return navigateTo(login+intendedQuery, { replace: true })
    }

    // Email not verified
    if (destinationDiffersFrom(emailNotVerifiedHome) && auth.user?.email_verified_at === null) {
        return navigateTo(emailNotVerifiedHome+intendedQuery, { replace: true })
    }

    // 2FA not verified
    if (destinationDiffersFrom(verify2FA) && auth.session.tfa_enabled && !auth.session.tfa_verified) {
        return navigateTo(verify2FA+intendedQuery, { replace: true })
    }

    // Not enabled
    if (destinationDiffersFrom(notEnabledHome) && auth.user?.enabled_at === null) {
        return navigateTo(notEnabledHome+intendedQuery, { replace: true })
    }

    // Blocked
    if (destinationDiffersFrom(blockedHome) && auth.user?.blocked_at !== null) {
        return navigateTo(blockedHome+intendedQuery, { replace: true })
    }

    // Requires password change
    if (destinationDiffersFrom(requirePasswordChangeHome) && auth.user?.requires_password_change) {
        return navigateTo(requirePasswordChangeHome+intendedQuery, { replace: true })
    }

    // Requires 2FA setup
    if (destinationDiffersFrom(requireTwoFactorSetupHome) && auth.user?.requires_two_factor && !auth.user?.has_tfa_enabled) {
        return navigateTo(requireTwoFactorSetupHome+intendedQuery, { replace: true })
    }
})
