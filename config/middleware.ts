export default {
    mapping: {
        '/auth/login':              ['catch-route-intent', 'guest', 'has-permissions'],
        '/auth/register':           ['catch-route-intent', 'guest', 'has-permissions'],
        '/auth/forgot-password':    ['catch-route-intent', 'guest', 'has-permissions'],
        '/auth/reset-password':     ['catch-route-intent', 'guest', 'has-permissions'],
        '/auth/email-not-verified': ['catch-route-intent', 'auth', 'email-not-verified', 'has-permissions'],
        '/auth/verify-2fa':         ['catch-route-intent', 'auth', '2fa-not-verified', 'has-permissions'],
        '/auth/not-enabled':        ['catch-route-intent', 'auth', 'not-enabled', 'has-permissions'],
        '/auth/blocked':            ['catch-route-intent', 'auth', 'blocked', 'has-permissions'],
        '/auth/change-password':    ['catch-route-intent', 'auth', 'require-password-change', 'has-permissions'],
        '/auth/setup-2fa':          ['catch-route-intent', 'auth', 'require-two-factor-setup', 'has-permissions'],
        'DEFAULT':                  ['auth', 'fulfill-route-intent', 'has-permissions'],
    },
}