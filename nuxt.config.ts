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
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  routeRules: {
    '/api/**': { proxy: 'http://ai-test.iappdaily.com/**' },
  },
  runtimeConfig: {
    public: {
      apiBase: '/api',
      appId: '1',
      appKey: '49f68a5c8493ec2c0bf489821c21fc3b',
    }
  },
  app: {
    head: {
      script: [
        {
          innerHTML: `
            (function() {
              try {
                const savedTheme = localStorage.getItem('theme-mode');
                const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) document.documentElement.classList.add('dark');
              } catch (e) {}
            })();
          `,
          type: 'text/javascript'
        }
      ]
    }
  }
})
