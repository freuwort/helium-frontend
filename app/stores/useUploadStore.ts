import _ from "lodash"

type Upload = {
    id: string
    name: string
    fileCount: number
    progress: number
    status: string
    abortController: AbortController | null
}



export const useUploadStore = defineStore('upload_manager', () => {

    const uploads = ref<Upload[]>([])

    const totalProgress = computed(() => {
        const uploading = uploads.value.filter(upload => upload.status === 'uploading')
        
        return Math.min(Math.round(uploading.reduce((acc, upload) => acc + upload.progress, 0) / uploading.length || 0), 100)
    })

    const status = computed(() => {
        return {
            total: uploads.value.reduce((acc, upload) => acc + upload.fileCount, 0),
            uploading: uploads.value.filter(upload => upload.status === 'uploading').reduce((acc, upload) => acc + upload.fileCount, 0),
            completed: uploads.value.filter(upload => upload.status === 'completed').reduce((acc, upload) => acc + upload.fileCount, 0),
            cancelled: uploads.value.filter(upload => upload.status === 'cancelled').reduce((acc, upload) => acc + upload.fileCount, 0),
        }
    })

    const statusText = computed(() => {
        const s = status.value

        if (s.uploading) return `Lade ${s.uploading} Dateien hoch (${totalProgress.value}%)`
        if (s.completed) return `${s.completed} Dateien hochgeladen`
        if (s.cancelled) return `${s.cancelled} Dateien abgebrochen`

        return ''
    })



    async function upload(path: string, files: any)
    {
        // Check if files are available
        if (!files.length) return
        
        const upload = reactive({
            id: Date.now()+'-'+Math.random(),
            name: 'Dateien',
            fileCount: files.length,
            progress: 0,
            status: 'uploading',
            abortController: new AbortController(),
        })
        
        const form = new FormData()
        
        form.append('path', path)
        
        for (let i = 0; i < files.length; i++)
        {
            form.append('files[]', files[i])
        }

        // Find best name
        const file = files[0]
        upload.name = file.name
        if (files.length > 1) upload.name += ` und ${files.length - 1} weitere`

        uploads.value.push(upload)
        
        const response = await useAxios().post('/api/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            signal: upload.abortController.signal,
            onUploadProgress: (progressEvent) => {
                upload.progress = Math.round(progressEvent.loaded / (progressEvent.total || 1) * 100)
            },
        })

        upload.status = 'completed'

        return response
    }



    function cancel(uploadId: string)
    {
        const upload = uploads.value.find(upload => upload.id === uploadId)

        if (!upload) return

        if (upload.status === 'uploading')
        {
            upload.abortController?.abort()
            upload.status = 'cancelled'
        }

        if (['cancelled', 'completed'].includes(upload.status))
        {
            _.remove(uploads.value, upload)
        }
    }



    function clearAll()
    {
        // clear all completed uploads
        uploads.value = uploads.value.filter(upload => upload.status !== 'completed')
    }



    return {
        uploads,
        totalProgress,
        status,
        statusText,
        upload,
        cancel,
        clearAll,
    }
})