import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi, getUserProfile, logout as logoutApi, type LoginParams, type RegisterParams } from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<any>(null)

  const setToken = (t: string) => {
    token.value = t
    localStorage.setItem('token', t)
  }

  const clearToken = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  const login = async (params: LoginParams) => {
    try {
      const res: any = await loginApi(params)
      // Assuming the API returns token in res.data or res.token. 
      // Based on common practices, I'll assume it might be in `data.token` or just `res` if interceptor strips wrapper.
      // The interceptor in request.ts returns `response.data`, so if the API response is `{ code: 200, data: { token: '...' } }`, we get `{ token: '...' }` (if the interceptor unwraps `data`) 
      // OR the interceptor returns `response.data` which is the full JSON body.
      // Looking at request.ts: `return response.data`.
      // Usage usually: const { data } = await ...
      
      // Let's assume standard response structure: { code: 200, data: { token: '...' }, message: '...' }
      // The interceptor returns `response.data`.
      // So `res` is the whole object.
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
      // Usually register might autologin or require login. For now just return success.
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
        router.push('/login')
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
