export default {
    mapping: {
        '/auth/login':              ['guest'],
        '/auth/register':           ['guest'],
        '/auth/forgot-password':    ['guest'],
        '/auth/reset-password':     ['guest'],
        '/auth/email-not-verified': ['auth', 'email-not-verified'],
        '/auth/verify-2fa':         ['auth', 'email-verified', '2fa-not-verified'],
        '/auth/not-enabled':        ['auth', 'email-verified', '2fa-verified', 'not-enabled'],
        '/auth/blocked':            ['auth', 'email-verified', '2fa-verified', 'enabled', 'blocked'],
        '/auth/change-password':    ['auth', 'email-verified', '2fa-verified', 'enabled', 'not-blocked', 'require-password-change'],
        '/auth/setup-2fa':          ['auth', 'email-verified', '2fa-verified', 'enabled', 'not-blocked', 'dont-require-password-change', 'require-two-factor-setup'],
        'DEFAULT':                  ['auth', 'email-verified', '2fa-verified', 'enabled', 'not-blocked', 'dont-require-password-change', 'dont-require-two-factor-setup'],
    },
}