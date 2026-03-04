import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  login as loginApi,
  register as registerApi,
  getUserProfile,
  logout as logoutApi,
  sendLoginCode,
  sendRegisterCode,
  getUploadUrl,
  getAccountRecords,
  type LoginParams,
  type RegisterParams
} from '~/utils/api'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<any>(null)

  // Initialize from storage on client mount if needed
  const initialize = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('token')
      if (storedToken) token.value = storedToken

      const storedUserInfo = localStorage.getItem('userInfo')
      if (storedUserInfo) {
        try {
          userInfo.value = JSON.parse(storedUserInfo)
        } catch (e) {
          console.error('Failed to parse stored userInfo', e)
        }
      }
    }
  }

  const setToken = (t: string) => {
    token.value = t
    if (import.meta.client) {
      localStorage.setItem('token', t)
    }
  }

  const clearToken = () => {
    token.value = ''
    userInfo.value = null
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }

  const router = useRouter()

  const login = async (params: LoginParams) => {
    try {
      const res: any = await loginApi(params)
      if (res.data?.token) {
        setToken(res.data.token)
        await fetchUserInfo()
        return res.data
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (params: RegisterParams) => {
    try {
      await registerApi(params)
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const sendCode = async (email: string) => {
    try {
      await sendRegisterCode(email)
      return true
    } catch (error) {
      console.error('Send code failed:', error)
      throw error
    }
  }

  const sendLoginCodeAction = async (email: string) => {
    try {
      await sendLoginCode(email)
      return true
    } catch (error) {
      console.error('Send login code failed:', error)
      throw error
    }
  }

  const fetchUserInfo = async () => {
    try {
      const res: any = await getUserProfile()
      userInfo.value = res.data
      if (import.meta.client) {
        localStorage.setItem('userInfo', JSON.stringify(res.data))
      }
      return res.data
    } catch (error) {
      console.error('Fetch user info failed:', error)
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      clearToken()
      router.push('/')
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      // 1. Get presigned URL
      const res: any = await getUploadUrl({
        file_name: file.name,
        content_type: file.type
      })
      const { url, key } = res.data

      // 2. Upload file to cloud storage
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type }
      })

      // 3. Update user profile with new avatar key
      const runtimeConfig = useRuntimeConfig().public
      const apiBase = runtimeConfig.apiBase || '/api'
      const authToken = localStorage.getItem('token')

      await fetch(`${apiBase}/v1/sso/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken || '',
          'x-app-domain': 'ai-test.iappdaily.com',
          'x-app-id': runtimeConfig.appId || '1'
        },
        body: JSON.stringify({ avatar: key })
      })

      // 4. Refresh user info to reflect changes
      await fetchUserInfo()
      return true
    } catch (error) {
      console.error('Upload avatar failed:', error)
      throw error
    }
  }

  const fetchAccountRecords = async (page = 1) => {
    try {
      const res: any = await getAccountRecords({ page, page_size: 20 })
      return res.data?.list || []
    } catch (error) {
      console.error('Fetch records failed:', error)
      return []
    }
  }

  return {
    token,
    userInfo,
    initialize,
    login,
    register,
    sendCode,
    sendLoginCodeAction,
    logout,
    fetchUserInfo,
    uploadAvatar,
    fetchAccountRecords
  }
})

