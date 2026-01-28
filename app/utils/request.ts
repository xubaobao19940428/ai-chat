import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { md5 } from 'js-md5'

// Define Params interface
interface Params {
  [key: string]: string | number;
}

// Random string helper
const randomString = (code: number) => {
  const len = code;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  const maxLen = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxLen))
  }
  return pwd
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: 'http://ai-test.iappdaily.com',
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
    config.baseURL = import.meta.client ? runtimeConfig.apiBase : 'http://ai-test.iappdaily.com'
    if (config.headers) {
      config.headers['x-app-id'] = import.meta.client ? runtimeConfig.appId : '1'
    }

    // Basic headers setup
    if (import.meta.client) {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `${token}`
      }
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = randomString(16);

    // URL params handling
    const urlParams: Record<string, string> = {};
    let baseUrl = config.url || '';
    if (config.url && config.url.includes('?')) {
      const urlParts = config.url.split('?');
      baseUrl = urlParts[0] || '';
      const queryString = urlParts[1];
      const params = new URLSearchParams(queryString);
      params.forEach((value, key) => {
        urlParams[key] = value;
      });
    }

    // Handle config.data potentially being JSON string
    let bodyParams = config.data || config.params || {};
    if (typeof bodyParams === 'string') {
      try {
        bodyParams = JSON.parse(bodyParams);
      } catch (e) {
        // keep as is if not json
      }
    }

    // Prepare params for signing
    const params: Params = {
      ...urlParams,
      ...bodyParams,
      timestamp,
      nonce
    };

    // Sort params and EXCLUDE objects/arrays from signature to avoid serialization mismatch
    // This is most likely the standard for this backend
    const sortedParams = Object.keys(params).sort().reduce((acc: Params, key: string) => {
      const val = params[key]
      if (val !== undefined && val !== null && typeof val !== 'object') {
        acc[key] = val
      }
      return acc;
    }, {} as Params);

    // Construct full path for signing
    const productionDomain = 'http://ai-test.iappdaily.com';
    let signingPath = baseUrl;
    if (signingPath.startsWith('/api')) {
      signingPath = signingPath.substring(4);
    }
    const fullPath = productionDomain.replace(/\/$/, '') + '/' + signingPath.replace(/^\//, '');

    // Generate query string
    const queryString = Object.entries(sortedParams)
      .map(([key, value]) => {
        const encodedKey = encodeURIComponent(key).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
        const encodedValue = encodeURIComponent(String(value)).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
        return `${encodedKey}=${encodedValue}`;
      })
      .join('&');

    const encodedFullPath = fullPath.replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
    const secretKey = runtimeConfig.appKey || '49f68a5c8493ec2c0bf489821c21fc3b';
    // Back to original concatenation style
    const sign = md5(encodedFullPath + queryString + secretKey);

    // Debug Logs (Enabled for debugging)


    // Update config
    config.url = baseUrl;
    config.params = {
      ...urlParams,
      ...config.params,
      timestamp,
      nonce,
      sign
    };

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
    // console.log('=== Response Debug ===');
    // console.log('Response Data:', res);
    // console.log('=======================');
    // 根据实际后端接口调整
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
