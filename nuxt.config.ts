/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
// import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
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
        // '/api/**': { proxy: 'https://ai-test.iappdaily.com/**' },
    },
    runtimeConfig: {
        public: {
            apiBase: 'https://ai-test.iappdaily.com',
            appId: '1',
            appKey: '49f68a5c8493ec2c0bf489821c21fc3b',
        }
    },
    vite: {
        // plugins: process.env.NODE_ENV === 'production' ? [
        //     obfuscatorPlugin({
        //         options: {
        //             compact: true,
        //             controlFlowFlattening: false,
        //             deadCodeInjection: false,
        //             debugProtection: false,
        //             disableConsoleOutput: true,
        //             identifierNamesGenerator: 'hexadecimal',
        //             renameGlobals: false,
        //             rotateStringArray: true,
        //             selfDefending: false,
        //             shuffleStringArray: true,
        //             splitStrings: false,
        //             stringArray: true,
        //             stringArrayThreshold: 0.75,
        //             transformObjectKeys: false,
        //             unicodeEscapeSequence: false,
        //         },
        //     })
        // ] : [],
    },

    app: {
        head: {
            title: 'Aura AI',
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
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
            ]
        }
    }
})
