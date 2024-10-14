export default {
    mapping: {
        '/login':               ['guest'],
        '/register':            ['guest'],
        '/forgot-password':     ['guest'],
        '/email-unverified':    ['auth', 'email-unverified'],
        '/verify-2fa':          ['auth', 'email-verified', '2fa-needed'],
        '/disabled':            ['auth', 'email-verified', '2fa-verified', 'disabled'],
        '/change-password':     ['auth', 'email-verified', '2fa-verified', 'enabled', 'require-password-change'],
        '/setup-2fa':           ['auth', 'email-verified', '2fa-verified', 'enabled', 'dont-require-password-change', 'require-two-factor-setup'],
        'DEFAULT':              ['auth', 'email-verified', '2fa-verified', 'enabled', 'dont-require-password-change', 'dont-require-two-factor-setup'],
    },
}