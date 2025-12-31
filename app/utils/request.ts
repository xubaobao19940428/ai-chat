import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.client ? useRuntimeConfig().public.apiBase : 'https://api.example.com/v1', // Fallback or direct use
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可以在这里添加token等认证信息
    if (import.meta.client) {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
        }
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
    // 根据实际后端接口调整
    if (res && typeof res === 'object' && 'code' in res && res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return response.data
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default service
