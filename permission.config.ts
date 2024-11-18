const AdminPanelAccess = 'system.access.admin.panel'
const Admin = 'system.admin'
const SuperAdmin = 'system.super-admin'

export default {
    '.*':                        {permissions: [AdminPanelAccess], alternativeRedirect: 'WEBSITE'},
    'auth.*':                    {permissions: []},
    'users.*':                   {permissions: [AdminPanelAccess, 'system.view.users']},
    'roles.*':                   {permissions: [AdminPanelAccess, 'system.view.roles']},
    'media.*':                   {permissions: [AdminPanelAccess, 'system.access.media']},
    'settings.*':                {permissions: [AdminPanelAccess, Admin]},
    'forms.*':                   {permissions: [AdminPanelAccess, 'app.view.forms']},
    'content.*':                 {permissions: [AdminPanelAccess, 'app.view.content']},
    'accounting-contacts.*':     {permissions: [AdminPanelAccess, 'app.view.accounting.contacts']},
} as PermissionConfig

type PermissionConfig = {[key: string]: { permissions: string[], alternativeRedirect?: string }}