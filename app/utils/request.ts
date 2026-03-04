import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { randomString, generateSign } from './sign'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: 'https://ai-test.iappdaily.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'x-app-domain': 'ai-test.iappdaily.com',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const runtimeConfig = useRuntimeConfig().public
    
    // Dynamic config setup
    config.baseURL = import.meta.client ? runtimeConfig.apiBase : 'https://ai-test.iappdaily.com'
    if (config.headers) {
      config.headers['x-app-id'] = import.meta.client ? runtimeConfig.appId : '1'
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
    const productionDomain = 'https://ai-test.iappdaily.com'
    let signingPath = baseUrl
    if (signingPath.startsWith('/api')) {
      signingPath = signingPath.substring(4)
    }
    const fullPath = productionDomain.replace(/\/$/, '') + '/' + signingPath.replace(/^\//, '')

    const secretKey = runtimeConfig.appKey || '49f68a5c8493ec2c0bf489821c21fc3b'
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
    if (res && typeof res === 'object' && 'code' in res && res.code !==0) {
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
