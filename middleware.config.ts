export default {
    mapping: {
        '/login':           ['guest'],
        '/register':        ['guest'],
        '/forgot-password': ['guest'],
        '/verify-2fa':      ['auth', '2fa-needed'],
        '/disabled':        ['auth', '2fa-verified', 'disabled'],
        'DEFAULT':          ['auth', '2fa-verified', 'enabled'],
    },
}