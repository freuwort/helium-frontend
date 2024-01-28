<template>
    <NuxtLayout name="auth-default" pageTitle="Dateien" color="var(--color-primary)">
        <Card>
            <input type="file" ref="uploadInput" multiple @change="upload($event?.target?.files || [])">
        </Card>
    </NuxtLayout>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: 'auth',
    })

    const uploadInput = ref<HTMLInputElement|null>(null)



    async function upload(files: any)
    {
        // Check if files are available
        if (!files.length) return

        // Create form data
        const form = new FormData()

        // Add files to form data
        for (let i = 0; i < files.length; i++)
        {
            form.append('files[]', files[i])
        }

        // Reset input
        if (uploadInput.value) uploadInput.value.value = ''
        
        const { data, status } = await useAxios().post('/api/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                console.log(Math.round(progressEvent.loaded / progressEvent.total * 100))
            }
        })

        console.log(data)
    }
</script>

<style lang="sass" scoped></style>
