export default {
    mapping: {
        '/login':                       ['guest'],
        '/register':                    ['guest'],
        '/forgot-password':             ['guest'],
        '/email-unverified':            ['auth', 'email-unverified'],
        '/verify-2fa':                  ['auth', 'email-verified', '2fa-needed'],
        '/disabled':                    ['auth', 'email-verified', '2fa-verified', 'disabled'],
        '/password-change-required':    ['auth', 'email-verified', '2fa-verified', 'enabled', 'password-change-required'],
        'DEFAULT':                      ['auth', 'email-verified', '2fa-verified', 'enabled', 'password-change-not-required'],
    },
}