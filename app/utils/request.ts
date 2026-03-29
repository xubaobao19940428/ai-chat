import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { randomString, generateSign } from './sign'
import { useUIStore } from '~/stores/ui'

const AUTH_ERRORS = new Set(['not_logined', 'not_login', 'unauthorized', 'token_expired'])

const handleAuthError = () => {
  if (!import.meta.client) return
  try {
    const uiStore = useUIStore()
    uiStore.openLoginModal()
  } catch (_) {}
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const runtimeConfig = useRuntimeConfig().public
    
    // Dynamic config setup from env variables
    config.baseURL = runtimeConfig.apiBase
    if (config.headers) {
      config.headers['x-app-id'] = runtimeConfig.appId
      try {
        const hostname = new URL(runtimeConfig.apiBase).hostname
        if (!hostname.includes('mixu.ai')) {
          config.headers['x-app-domain'] = hostname
        }
      } catch {}
    }

    // Auth token
    if (import.meta.client) {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `${token}`
      }
    }

    const timestamp = Math.floor(Date.now() / 1000)
    const nonce = randomString(16)

    // URL params handling
    const urlParams: Record<string, string> = {}
    let baseUrl = config.url || ''
    if (config.url && config.url.includes('?')) {
      const urlParts = config.url.split('?')
      baseUrl = urlParts[0] || ''
      const queryString = urlParts[1]
      const params = new URLSearchParams(queryString)
      params.forEach((value, key) => {
        urlParams[key] = value
      })
    }

    // Handle config.data potentially being JSON string
    let bodyParams = config.data || config.params || {}
    if (typeof bodyParams === 'string') {
      try {
        bodyParams = JSON.parse(bodyParams)
      } catch (e) {
        // keep as is if not json
      }
    }

    // Prepare params for signing
    const allParams: Record<string, any> = {
      ...urlParams,
      ...bodyParams,
      timestamp,
      nonce
    }

    // Construct full path for signing
    const apiBase = runtimeConfig.apiBase.replace(/\/$/, '')
    let signingPath = baseUrl
    if (signingPath.startsWith('/api')) {
      signingPath = signingPath.substring(4)
    }
    const fullPath = apiBase + '/' + signingPath.replace(/^\//, '')

    const secretKey = runtimeConfig.appKey
    const sign = generateSign(fullPath, allParams, secretKey)

    // Update config
    config.url = baseUrl
    config.params = {
      ...urlParams,
      ...config.params,
      timestamp,
      nonce,
      sign
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data as any
    if (res && typeof res === 'object' && 'code' in res && res.code !== 0) {
      if (AUTH_ERRORS.has(res.message)) {
        handleAuthError()
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return response.data
  },
  (error) => {
    console.error('request error:', error)
    return Promise.reject(error)
  }
)

export default service
