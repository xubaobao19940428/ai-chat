/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config
// import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: false },
    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/i18n'],
    i18n: {
        strategy: 'no_prefix',
        locales: [
            { code: 'en', file: 'en.json', name: 'English' },
            { code: 'zh', file: 'zh.json', name: '简体中文' },
            { code: 'ja', file: 'ja.json', name: '日本語' },
            { code: 'ko', file: 'ko.json', name: '한국어' },
            { code: 'es', file: 'es.json', name: 'Español' },
            { code: 'fr', file: 'fr.json', name: 'Français' },
            { code: 'de', file: 'de.json', name: 'Deutsch' },
            { code: 'pt', file: 'pt.json', name: 'Português' }
        ],
        lazy: true,
        langDir: 'locales',
        defaultLocale: 'en',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root'
        }
    },
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
                // Read theme from cookie (same source as Pinia store's useCookie)
                var cookieVal = document.cookie.split(';').reduce(function(acc, c) {
                  var parts = c.trim().split('=');
                  return parts[0] === 'theme-mode' ? decodeURIComponent(parts[1]) : acc;
                }, null);
                var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var isDark = cookieVal === 'dark' || (cookieVal === 'system' && systemDark) || (!cookieVal && systemDark);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                  document.body && (document.body.style.backgroundColor = '#000000');
                } else {
                  document.documentElement.style.colorScheme = 'light';
                  document.body && (document.body.style.backgroundColor = '#fcfbfb');
                }
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
