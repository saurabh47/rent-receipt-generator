// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'Rent Receipt Generator',
            meta: [
              // <meta name="description" content="My amazing site">
              { name: 'description', content: 'Free Rent Receipt Generator' }
            ],
        }
    },
    plugins: ['@/plugins/antd'],
    runtimeConfig: {
        public: {
            baseURL: process.env.VUE_APP_API_BASE_URL,
        }
    }
})
