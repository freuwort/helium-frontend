<template>
    <h3 class="m-0 text-base font-medium">Backup wiederherstellen</h3>
    <SettingsRow title="Backup auswählen und wiederherstellen">
        <input class="hidden" type="file" ref="importInput" @change="importBackup()" accept=".zip" />
        <IodButton type="button" class="flex-1" corner="m" size="s" icon-left="folder_zip" label="Auswählen" color-preset="success" :loading="importProcessing" @click="importInput.click()"/>
    </SettingsRow>
    <div class="h-8"></div>
    

    <!-- <form class="contents" @submit.prevent="saveBackupSettings()">
        <h3 class="m-0 text-base font-medium">Backup Einstellungen</h3>
        <SettingsRow title="Automatische Backups aktivieren">
            <IodToggle type="switch" class="!min-h-0" v-model="backupSettingsForm.backup_auto_enabled"/>
        </SettingsRow>
        <template v-if="backupSettingsForm.backup_auto_enabled">
            <SettingsRow title="-> Intervall">
                <IodSelect class="flex-1 !h-8" placeholder="Interval" v-model="backupSettingsForm.backup_auto_interval" :options="options_interval"/>
            </SettingsRow>
            <SettingsRow title="-> Uhrzeit">
                <IodSelect class="flex-1 !h-8" placeholder="Uhrzeit" v-model="backupSettingsForm.backup_auto_time" :options="options_time"/>
            </SettingsRow>
        </template>
        <SettingsRow title="Aufbewahrung (auto & manuell)">
            <IodSelect class="flex-1 !h-8" placeholder="Aufbewahrung" v-model="backupSettingsForm.backup_retention" :options="options_retention" />
        </SettingsRow>
        <SettingsRow>
            <IodButton class="flex-1" corner="m" size="s" label="Speichern" :loading="backupSettingsForm.processing"/>
        </SettingsRow>
        <HeDivider class="my-4"/>
    </form> -->


    <h3 class="m-0 text-base font-medium">Backups</h3>
    <IodTable
        class="p-4 w-full border"
        :scope
        :columns="tableColumns"
        :actions="tableActions"
        :items="backups"
        :loading="false"
        :has-selection="false"
        :has-search="false"
        :should-paginate="false"
        @request:refresh="fetchBackups()"
    >
        <template #left>
            <IodButton type="button" corner="m" size="s" icon-left="add" label="Backup erstellen" :loading="backupForm.processing" @click="saveBackup()"/>
        </template>
    </IodTable>
</template>

<script lang="ts" setup>
    import type { Backup } from '~/types/backup'
    import { toast } from 'vue3-toastify'
    import TableColumnBuilder from '~/classes/Builder/TableColumnBuilder'
    
    const domain = useDomainStore()
    const dayjs = useDayjs()
    const runtimeConfig = useRuntimeConfig()
    const scope = 'view_admin_settings_backup'

    const tableColumnBuilder = new TableColumnBuilder()
    const tableColumns = [
        tableColumnBuilder.new().name('name').label('Name').sortable(false).resizable(false).width(280).build(),
        tableColumnBuilder.new().name('size').label('Größe').sortable(false).resizable(false).transform((value: any) => humanFileSize(value) || null).build(),
        tableColumnBuilder.new().name('created_at').label('Erstellt').sortable(false).resizable(false).transform((value: string | null) => ({
            text: value ? dayjs(value).fromNow() : '-',
            tooltip: value ? dayjs(value).format('DD.MM.YYYY HH:mm') : '-',
        })).build(),
    ]

    const tableActions = [
        {
            icon: 'refresh',
            text: 'Aktualisieren',
            scope: ['global'],
            run: () => fetchBackups(),
        },
        {
            icon: 'download',
            text: 'Herunterladen',
            scope: ['individual', 'row'],
            run: (context: string, items: any) => downloadBackup(items[0]),
        },
        {
            icon: 'delete',
            text: 'Löschen',
            color: 'error',
            scope: ['individual'],
            run: (context: string, items: any) => deleteBackup(items[0]),
        },
    ]

    const options_interval = ref([
        { value: 'daily', text: 'Täglich', },
        { value: 'weekly', text: 'Wöchentlich', },
        { value: 'monthly', text: 'Monatlich', },
        { value: 'yearly', text: 'Jährlich', },
    ])

    const options_time = ref([
        { value: '00:00', text: '00:00 UTC', },
        { value: '01:00', text: '01:00 UTC', },
        { value: '02:00', text: '02:00 UTC', },
        { value: '03:00', text: '03:00 UTC', },
        { value: '04:00', text: '04:00 UTC', },
        { value: '05:00', text: '05:00 UTC', },
        { value: '06:00', text: '06:00 UTC', },
        { value: '07:00', text: '07:00 UTC', },
        { value: '08:00', text: '08:00 UTC', },
        { value: '09:00', text: '09:00 UTC', },
        { value: '10:00', text: '10:00 UTC', },
        { value: '11:00', text: '11:00 UTC', },
        { value: '12:00', text: '12:00 UTC', },
        { value: '13:00', text: '13:00 UTC', },
        { value: '14:00', text: '14:00 UTC', },
        { value: '15:00', text: '15:00 UTC', },
        { value: '16:00', text: '16:00 UTC', },
        { value: '17:00', text: '17:00 UTC', },
        { value: '18:00', text: '18:00 UTC', },
        { value: '19:00', text: '19:00 UTC', },
        { value: '20:00', text: '20:00 UTC', },
        { value: '21:00', text: '21:00 UTC', },
        { value: '22:00', text: '22:00 UTC', },
        { value: '23:00', text: '23:00 UTC', },
    ])

    const options_retention = ref([
        { value: 1, text: '1 Tag', },
        { value: 7, text: '7 Tage', },
        { value: 30, text: '30 Tage', },
        { value: 90, text: '90 Tage', },
        { value: 180, text: '180 Tage', },
        { value: 365, text: '365 Tage', },
    ])



    // Backup settings
    const backupSettingsForm = useForm({
        backup_auto_interval: domain?.settings?.backup_auto_interval ?? 'week',
        backup_auto_time: domain?.settings?.backup_auto_time ?? '03:00',
        backup_auto_enabled: domain?.settings?.backup_auto_enabled ?? false,
        backup_retention: domain?.settings?.backup_retention ?? 30,
    })

    function saveBackupSettings() {
        backupSettingsForm.patch('/api/settings', {
            onSuccess() {
                toast.success('Einstellungen gespeichert')
                domain.fetchSettings()
            }
        })
    }



    // Store backup
    const backupForm = useForm({})
    function saveBackup() {
        backupForm.post('/api/backups/store', {
            onSuccess() {
                toast.info('Backup wird im Hintergrund erstellt')
            },
            onError() {
                toast.error('Backup konnte nicht erstellt werden')
            }
        })
    }



    // Restore backup
    const importInput = ref()
    const importProcessing = ref(false)
    async function importBackup() {
        const file = importInput.value.files[0]
        if (!file) return

        importProcessing.value = true
        const formData = new FormData()
        formData.append('file', file)

        await useAxios().postForm('/api/backups/restore', formData)

        importInput.value.value = null
        importProcessing.value = false
    }



    // Download backup
    function downloadBackup(id: string) {
        window.open(`${runtimeConfig.public.backendUrl}/api/backups/${id}`, '_blank')
    }



    // Delete backup
    function deleteBackup(id: string) {
        useAxios().delete(`/api/backups/${id}`).then(() => {
            toast.info(`Backup gelöscht`)
            fetchBackups()
        }).catch(() => {
            toast.error('Backup konnte nicht gelöscht werden')
        })
    }
    


    // Fetch backups
    const backups = ref<Backup[]>([])
    function fetchBackups() {
        useAxios().get('/api/backups').then(response => {
            backups.value = response.data.data || []
        }).catch(error => {
            toast.error('Fehler beim Laden der Backups')
        })
    }

    onMounted(() => {
        fetchBackups()
    })
</script>

<style lang="sass" scoped>
    .w-18
        width: 18rem !important
</style>
