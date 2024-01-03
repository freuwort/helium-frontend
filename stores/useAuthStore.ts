type User = {
    name: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>({
        name: 'Alexander',
    })

    return { user }
})