// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css', 'highlight.js/styles/atom-one-dark.css'],
  devServer: {
    port: 4000,
    host: '0.0.0.0',
  },
  runtimeConfig: {
    public: {
      apiBase: 'https://api.example.com'
    }
  }
})
