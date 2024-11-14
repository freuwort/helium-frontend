export default {
    mapping: {
        '/auth/login':              ['catch-route-intent', 'guest'],
        '/auth/register':           ['catch-route-intent', 'guest'],
        '/auth/forgot-password':    ['catch-route-intent', 'guest'],
        '/auth/reset-password':     ['catch-route-intent', 'guest'],
        '/auth/email-not-verified': ['catch-route-intent', 'auth', 'email-not-verified'],
        '/auth/verify-2fa':         ['catch-route-intent', 'auth', '2fa-not-verified'],
        '/auth/not-enabled':        ['catch-route-intent', 'auth', 'not-enabled'],
        '/auth/blocked':            ['catch-route-intent', 'auth', 'blocked'],
        '/auth/change-password':    ['catch-route-intent', 'auth', 'require-password-change'],
        '/auth/setup-2fa':          ['catch-route-intent', 'auth', 'require-two-factor-setup'],
        'DEFAULT':                  ['auth', 'fulfill-route-intent'],
    },
}