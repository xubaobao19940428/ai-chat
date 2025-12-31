import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi, getUserProfile, logout as logoutApi, type LoginParams, type RegisterParams } from '~/utils/api'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const userInfo = ref<any>(null)

  // Initialize from storage on client mount if needed, or use a separate init action or persist plugin.
  // We'll use a hydrate action or just check localStorage in actions for token init, 
  // but better to initialize state if possible.
  if (import.meta.client) {
    token.value = localStorage.getItem('token') || ''
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
    }
  }
  
  const router = useRouter() // Nuxt auto-import

  const login = async (params: LoginParams) => {
    try {
      const res: any = await loginApi(params)
      if (res.data?.token) {
        setToken(res.data.token)
        await fetchUserInfo()
        return true
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

  const fetchUserInfo = async () => {
    try {
       const res: any = await getUserProfile()
       userInfo.value = res.data
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
        router.push('/login') // Wait, Login page is removed? Using Modal?
        // If using modal, we might just reload or redirect to home.
        // Legacy code redirected to /login.
        // But implementation plan says "Use Modal... Redirect to Home AND show modal".
        // But for logout, we just logout.
        router.push('/')
    }
  }

  return {
    token,
    userInfo,
    login,
    register,
    logout,
    fetchUserInfo
  }
})
