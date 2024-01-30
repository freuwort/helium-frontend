type Uploads = {
    name: string
    fileCount: number
    progress: number
    status: string
}

export const useUploadStore = defineStore('upload_manager', () => {
    const uploads = ref<Uploads[]>([])

    async function uploadFiles(path: string, files: any)
    {
        // Check if files are available
        if (!files.length) return

        // Create upload object
        const upload = {
            name: 'Test',
            fileCount: files.length,
            progress: 0,
            status: 'uploading'
        }

        // Add upload to uploads array
        uploads.value.push(upload)

        // Create form data
        const form = new FormData()

        // Add files to form data
        for (let i = 0; i < files.length; i++)
        {
            form.append('files[]', files[i])
        }

        // Add directory to form data
        form.append('path', path)
        
        const response = await useAxios().post('/api/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                upload.progress = Math.round(progressEvent.loaded / (progressEvent.total || 1) * 100)
            }
        })

        // Update upload status
        upload.status = 'completed'

        return response
    }

    return { uploads, uploadFiles }
})