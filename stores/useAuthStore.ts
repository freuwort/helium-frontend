type User = {
    name: string
    image: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>({
        name: 'Alexander',
        image: 'https://avatar.iran.liara.run/public/81'
    })

    return { user }
})