export default defineNuxtPlugin({
    name: 'watch-theme',
    setup() {
        const auth = useAuthStore()
        const userTheme = computed(() => auth.user?.settings.theme)
        const systemTheme = computed(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        const theme = computed(() => !userTheme.value || userTheme.value === 'system' ? systemTheme.value : userTheme.value)

        // Initial update
        update()

        // Watch for changes
        watch(theme, update)

        
        // Update the html attribute
        function update()
        {
            document.documentElement.setAttribute('data-theme', theme.value)
        }
    }
})