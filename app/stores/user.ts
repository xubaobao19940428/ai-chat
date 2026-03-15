import { defineStore } from 'pinia'
import { ref } from 'vue'

import {
  login as loginApi,
  register as registerApi,
  getUserProfile,
  logout as logoutApi,
  sendLoginCode,
  sendRegisterCode,
  uploadFile,
  getAccountRecords,
  type LoginParams,
  type RegisterParams,
} from '~/utils/api'
import request from '../utils/request'

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
      // 1. Upload file using the helper (this also records it in the backend)
      const { key } = await uploadFile(file, 'avatar')

      // 2. Update user profile with new avatar key using established request utility
      await request.post('/v1/sso/user', { avatar: key })

      // 3. Refresh user info to reflect changes
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

