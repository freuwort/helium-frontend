const AdminPanelAccess = 'system.access.admin.panel'

export default {
    '.*':                        {permissions: [AdminPanelAccess], redirect: '{{WEBSITE}}'},
    'auth.*':                    {permissions: []},
    'users.*':                   {permissions: [AdminPanelAccess, 'system.view.users']},
    'roles.*':                   {permissions: [AdminPanelAccess, 'system.view.roles']},
    'media.*':                   {permissions: [AdminPanelAccess, 'system.access.media']},
    'settings.*':                {permissions: [AdminPanelAccess, 'system.admin']},
    'forms.*':                   {permissions: [AdminPanelAccess, 'app.view.forms']},
    'content.*':                 {permissions: [AdminPanelAccess, 'app.view.content']},
    'accounting-contacts.*':     {permissions: [AdminPanelAccess, 'app.view.accounting.contacts']},
} as PermissionConfig

type PermissionConfig = {[key: string]: { permissions: string[], redirect?: string }}